// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyCustomToken is ERC20 {
    uint8 private _decimals;

    constructor(
        string memory _tokenName,
        string memory _tokenSymbol,
        uint256 _initialSupply,
        uint8 decimal,
        address _owner
    ) ERC20(_tokenName, _tokenSymbol) {
        _decimals = decimal;
        _mint(_owner, _initialSupply * 10 ** uint256(decimal));
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
} 

contract TokenStaking is Ownable, ReentrancyGuard {
    struct Pool {
        IERC20 stakingToken;
        IERC20 rewardToken;
        uint256 poolId;
        uint256 duration;
        uint256 rewardRate;
        uint256 minStakeAmount;
        bool active;
        mapping(address => uint256) balances;
        mapping(address => uint256) depositTimes;
        mapping(address => uint256) lastProfitWithdrawalTime;
    }
    uint256 public _poolIndex;
    MyCustomToken[] public allTokens;
    Pool[] public pools;
    mapping(address => bool) public validForReferrer;
    mapping(address => address) public referredBy;
    mapping(address => address[]) public referrals;

    event PoolCreated(
        uint256 poolId,
        address stakingToken,
        address rewardToken,
        uint256 duration,
        uint256 rewardRate,
        bool active
    );
    event TokenCreated(
        address tokenAddress,
        string name,
        string symbol,
        uint256 initialSupply
    );
    event DepositTimeUpdated(
        address indexed user,
        uint256 poolId,
        uint256 newDepositTime
    );
    event BalanceUpdated(
        address indexed user,
        uint256 poolId,
        uint256 newBalance
    );
    event RewardRateUpdated(uint256 poolId, uint256 newRewardRate);
    event DurationUpdated(uint256 poolId, uint256 newDuration);
    event ProfitWithdrawn(address indexed user, uint256 profit, uint256 poolId);
    event Staked(address indexed user, uint256 amount, uint256 poolId);
    event Withdrawn(
        address indexed user,
        uint256 amount,
        uint256 reward,
        uint256 poolId
    );

    function getAllTokens() public view returns (MyCustomToken[] memory) {
        return allTokens;
    }

    function getAllPoolIds() public view returns (uint256[] memory) {
        uint256[] memory poolIds = new uint256[](pools.length);
        for (uint256 i = 0; i < pools.length; i++) {
            poolIds[i] = i;
        }
        return poolIds;
    }

    constructor() Ownable() {}

    function transferTokenToContract(
        uint256 _amount,
        address _tokenAddress
    ) external onlyOwner {
        require(_amount > 0, "Invalid Amount");

        IERC20 token = IERC20(_tokenAddress);

        uint256 allowance = token.allowance(msg.sender, address(this));
        require(allowance >= _amount, "Check the token allowance");

        token.transferFrom(msg.sender, address(this), _amount);
    }

    function createToken(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint8 decimal
    ) external onlyOwner returns (address) {
        MyCustomToken newToken = new MyCustomToken(
            name,
            symbol,
            initialSupply,
            decimal,
            msg.sender
        );
        allTokens.push(newToken);
        emit TokenCreated(address(newToken), name, symbol, initialSupply);
        return address(newToken);
    }

    function createPool(
        address stakingToken,
        address rewardToken,
        uint256 duration,
        uint256 rewardRate
    ) external onlyOwner {
        Pool storage newPool = pools.push();
        newPool.stakingToken = IERC20(stakingToken);
        newPool.rewardToken = IERC20(rewardToken);
        newPool.duration = duration;
        newPool.rewardRate = rewardRate;
        newPool.active = true;
        newPool.poolId = _poolIndex;
        _poolIndex++;
        uint256 poolId = pools.length - 1;
        emit PoolCreated(
            poolId,
            stakingToken,
            rewardToken,
            duration,
            rewardRate,
            true
        );
    }

    function deactivePool(uint256 _poolId) external onlyOwner {
        require(_poolId > 0 && _poolId < pools.length, "Invalid Pool Id");
        pools[_poolId].active = false;
    }

    function setMinStakeAmount(
        uint256 _amount,
        uint8 _poolId
    ) external onlyOwner {
        Pool storage pool = pools[_poolId];
        pool.minStakeAmount = _amount;
    }

    function addReferral(address referrer) external {
        require(referrer != msg.sender, "You cannot refer yourself");
        require(referredBy[msg.sender] == address(0), "Referrer already set");
        require(validForReferrer[referrer], "Referral not valid until staking");
        referredBy[msg.sender] = referrer;
        referrals[referrer].push(msg.sender);
    }

    function stake(uint256 _amount, uint256 _poolId) external nonReentrant {
        require(_poolId < pools.length, "Invalid pool id");
        require(_amount > 0, "Amount must be greater than 0");
        Pool storage pool = pools[_poolId];
        require(pool.active == true, "This pool is currently deactive.");
        require(
            _amount >= pool.minStakeAmount,
            "Minimum stake Amount require."
        );
        require(
            pool.stakingToken.balanceOf(msg.sender) >= _amount,
            "Insufficient balance"
        );
        require(
            pool.stakingToken.allowance(msg.sender, address(this)) >= _amount,
            "Insufficient allowance"
        );
        validForReferrer[msg.sender] = true;
        pool.stakingToken.transferFrom(msg.sender, address(this), _amount);
        pool.balances[msg.sender] += _amount;
        pool.depositTimes[msg.sender] = block.timestamp;
        emit Staked(msg.sender, _amount, _poolId);
        emit BalanceUpdated(msg.sender, _poolId, pool.balances[msg.sender]);
    }

    function calculateProfit(
        address user,
        uint256 poolId
    ) public view returns (uint256) {
        require(poolId < pools.length, "Invalid pool id");
        Pool storage pool = pools[poolId];
        uint256 userBalance = pool.balances[user];
        if (userBalance == 0) return 0;

        // Check if pool duration is zero to avoid division by zero error
        if (pool.duration == 0) return 0;

        uint256 lastActionTime = max(
            pool.depositTimes[user],
            pool.lastProfitWithdrawalTime[user]
        );
        uint256 currentTime = block.timestamp;
        uint256 lastDate = pool.depositTimes[user] + pool.duration;
        if (currentTime >= lastDate) currentTime = lastDate;

        uint256 stakedDuration = currentTime - lastActionTime;

        uint256 rewardRatePerSecond = (pool.rewardRate * 1e18) /
            pool.duration /
            10000;
        uint256 profit = (stakedDuration * rewardRatePerSecond * userBalance) /
            1e18;

        return profit;
    }

    function withdrawAllAmount(uint256 _poolId) external nonReentrant {
        require(_poolId < pools.length, "Invalid pool id");
        Pool storage pool = pools[_poolId];
        uint256 amount = pool.balances[msg.sender];
        require(amount > 0, "No balance to withdraw");

        uint256 stakedDuration = block.timestamp -
            pool.depositTimes[msg.sender];
        uint256 reward = 0;
        if (stakedDuration >= pool.duration) {
            reward = calculateProfit(msg.sender, _poolId);
        }

        distributeReferralRewards(reward, msg.sender, _poolId);

        pool.balances[msg.sender] = 0;
        pool.depositTimes[msg.sender] = 0;

        pool.stakingToken.transfer(msg.sender, amount);
        pool.rewardToken.transfer(msg.sender, reward);

        emit ProfitWithdrawn(msg.sender, reward, _poolId);
        emit Withdrawn(msg.sender, amount, reward, _poolId);
    }

    function distributeReferralRewards(
        uint256 reward,
        address user,
        uint256 poolId
    ) internal {
        uint256 level1Profit = (reward * 5) / 100;
        uint256 level2Profit = (reward * 3) / 100;
        uint256 level3Profit = (reward * 1) / 100;

        address level1Ref = referredBy[user];
        address level2Ref = referredBy[level1Ref];
        address level3Ref = referredBy[level2Ref];

        Pool storage pool = pools[poolId];
        if (level1Ref != address(0))
            pool.rewardToken.transfer(level1Ref, level1Profit);
        if (level2Ref != address(0))
            pool.rewardToken.transfer(level2Ref, level2Profit);
        if (level3Ref != address(0))
            pool.rewardToken.transfer(level3Ref, level3Profit);
    }

    function withdrawSpecificProfit(
        uint256 amount,
        uint256 _poolId
    ) external nonReentrant {
        require(_poolId < pools.length, "Invalid pool id");
        uint256 profit = calculateProfit(msg.sender, _poolId);
        require(profit >= amount, "Not enough profit");
        pools[_poolId].lastProfitWithdrawalTime[msg.sender] = block.timestamp;
        pools[_poolId].rewardToken.transfer(msg.sender, amount);
        emit ProfitWithdrawn(msg.sender, amount, _poolId);
    }

    function withdrawProfit(uint256 _poolId) external nonReentrant {
        require(_poolId < pools.length, "Invalid pool id");
        uint256 profit = calculateProfit(msg.sender, _poolId);
        require(profit > 0, "No profit available");
        distributeReferralRewards(profit, msg.sender, _poolId);
        pools[_poolId].lastProfitWithdrawalTime[msg.sender] = block.timestamp;
        pools[_poolId].rewardToken.transfer(msg.sender, profit);
        emit ProfitWithdrawn(msg.sender, profit, _poolId);
    }

    function showMyBalancesInPool(
        address _addr,
        uint256 _poolId
    ) public view returns (uint256) {
        require(_poolId < pools.length, "Invalid pool id");
        return pools[_poolId].balances[_addr];
    }

    function max(uint256 a, uint256 b) private pure returns (uint256) {
        return a >= b ? a : b;
    }
}
