-- Level 1: SELECT / WHERE / ORDER BY

-- 1.1 查看证券主数据
SELECT
    ticker,
    company_name,
    sector,
    currency
FROM securities
ORDER BY ticker;

-- 1.2 筛选收盘价不低于 110 的记录
SELECT
    security_id,
    trade_date,
    close_price,
    volume
FROM daily_prices
WHERE close_price >= 110.00
ORDER BY close_price DESC, trade_date DESC;

-- 1.3 查看指定日期区间内成交量最高的 10 条记录
SELECT
    security_id,
    trade_date,
    close_price,
    volume
FROM daily_prices
WHERE trade_date BETWEEN DATE '2025-01-15' AND DATE '2025-02-12'
ORDER BY volume DESC
LIMIT 10;
