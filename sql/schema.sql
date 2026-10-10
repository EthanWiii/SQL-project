-- Global Markets SQL Learning Project
-- PostgreSQL 14+

DROP TABLE IF EXISTS daily_prices;
DROP TABLE IF EXISTS securities;

CREATE TABLE securities (
    security_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ticker VARCHAR(10) NOT NULL UNIQUE,
    company_name VARCHAR(100) NOT NULL,
    sector VARCHAR(50) NOT NULL,
    currency CHAR(3) NOT NULL DEFAULT 'USD',
    CONSTRAINT ticker_uppercase CHECK (ticker = UPPER(ticker))
);

CREATE TABLE daily_prices (
    price_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    security_id INTEGER NOT NULL
        REFERENCES securities (security_id)
        ON DELETE CASCADE,
    trade_date DATE NOT NULL,
    open_price NUMERIC(12, 2) NOT NULL CHECK (open_price > 0),
    high_price NUMERIC(12, 2) NOT NULL CHECK (high_price > 0),
    low_price NUMERIC(12, 2) NOT NULL CHECK (low_price > 0),
    close_price NUMERIC(12, 2) NOT NULL CHECK (close_price > 0),
    volume BIGINT NOT NULL CHECK (volume >= 0),
    CONSTRAINT valid_daily_range CHECK (
        high_price >= GREATEST(open_price, close_price)
        AND low_price <= LEAST(open_price, close_price)
        AND high_price >= low_price
    ),
    CONSTRAINT one_price_per_security_per_day
        UNIQUE (security_id, trade_date)
);

CREATE INDEX idx_daily_prices_trade_date
    ON daily_prices (trade_date);
