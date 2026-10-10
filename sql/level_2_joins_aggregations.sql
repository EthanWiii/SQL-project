-- Level 2: JOIN / GROUP BY / HAVING

-- 2.1 JOIN：把 ticker 和公司名称添加到每日行情中
SELECT
    s.ticker,
    s.company_name,
    p.trade_date,
    p.close_price,
    p.volume
FROM securities AS s
JOIN daily_prices AS p
    ON p.security_id = s.security_id
ORDER BY s.ticker, p.trade_date;

-- 2.2 GROUP BY：计算每只证券的区间统计值
SELECT
    s.ticker,
    COUNT(*) AS trading_days,
    ROUND(AVG(p.close_price), 2) AS avg_close,
    MIN(p.close_price) AS min_close,
    MAX(p.close_price) AS max_close,
    SUM(p.volume) AS total_volume
FROM securities AS s
JOIN daily_prices AS p
    ON p.security_id = s.security_id
GROUP BY s.ticker
ORDER BY avg_close DESC;

-- 2.3 HAVING：找出平均收盘价高于 70 的证券
SELECT
    s.ticker,
    ROUND(AVG(p.close_price), 2) AS avg_close
FROM securities AS s
JOIN daily_prices AS p
    ON p.security_id = s.security_id
GROUP BY s.ticker
HAVING AVG(p.close_price) > 70
ORDER BY avg_close DESC;
