# MarketScope Frontend

MarketScope is the interactive analytics interface for the PostgreSQL Financial Markets project. It uses the same deterministic simulated-data rules as `sql/seed.sql`, so the complete experience works without third-party APIs.

## Features

- Ten-stock market universe spanning technology, financials, energy, consumer, semiconductors, and automotive
- Security selector and scrollable market watchlist
- Latest close, cumulative return, MA20, five-day momentum, and 20-day annualized volatility
- Interactive close-price and MA20 chart
- Daily-return and trading-volume visualizations
- Searchable OHLCV market-data table
- Light and dark themes with responsive desktop and mobile layouts
- On-page project architecture and technology stack

## Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Data ingestion | Python | Extract, validate, and load market data |
| Database | PostgreSQL | Normalized securities and daily-price storage |
| Analytics | Advanced SQL | CTEs, returns, moving averages, momentum, and rolling volatility |
| Frontend | HTML, CSS, JavaScript | Responsive interactive market dashboard |
| Reporting | Power BI | Executive dashboards and portfolio reporting |
| Automation | Power Automate | Data-quality alerts and reporting workflows |

## Run Locally

From the `frontend` directory:

```bash
python3 -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080). The project has no frontend package dependencies and can also be opened directly from `index.html`.

## Data Notice

All prices are simulated for engineering and analytics demonstrations. Recognizable company names and ticker symbols identify the sample market universe; the displayed values are not live quotes and must not be used for investment decisions.
