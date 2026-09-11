# Financial Markets Data Pipeline & Analytics Platform

> **Status:** In Progress

An end-to-end financial data engineering and analytics project designed to ingest, validate, transform, store, and analyze market and portfolio data.

The project is being built to demonstrate practical skills in **Python, SQL, PostgreSQL, ETL, data modeling, financial analytics, Power BI, and workflow automation**.

---

## Project Goals

This project aims to build a small but realistic financial data platform that can:

- Ingest historical and daily market data for equities, ETFs, and benchmarks
- Clean and validate incoming data before loading it into a database
- Store normalized market, security, portfolio, holding, and transaction data in PostgreSQL
- Use SQL to transform raw data into analytics-ready datasets
- Calculate portfolio and security-level performance and risk metrics
- Monitor pipeline execution and data-quality issues
- Visualize portfolio, risk, and operational metrics in Power BI
- Automate alerts, reporting, and operational workflows with Power Automate

---

## Planned Architecture

```text
Market / Portfolio Data
          |
          v
     Python ETL
          |
          v
     PostgreSQL
      /       \
     v         v
SQL Analytics  Data Quality
     |         |
     v         v
  Power BI   Power Automate
     |         |
     v         v
 Dashboards   Alerts / Reports / Workflows
```

---

## Planned Tech Stack

### Data Engineering
- Python
- SQL
- PostgreSQL
- ETL / ELT workflows
- Relational data modeling
- Data validation and quality checks

### Financial Analytics
- Daily and cumulative returns
- Portfolio P&L
- Rolling volatility
- Maximum drawdown
- Beta vs. benchmark
- Portfolio weights and concentration
- Sector and asset-class exposure
- Benchmark comparison

### Visualization & Automation
- Power BI
- DAX
- Power Automate
- Scheduled reporting
- Pipeline failure alerts
- Data-quality exception alerts
- File-based workflow automation

---

## Planned Database Model

Initial core tables:

```text
securities
daily_prices
portfolios
holdings
transactions
pipeline_runs
data_quality_log
```

The project will separate raw operational data from analytics-ready tables and views so that transformation logic remains reproducible and auditable.

---

## SQL Skills Demonstrated

The analytics layer will make use of:

- JOINs
- CTEs
- Window functions
- `LAG()` / `LEAD()`
- `ROW_NUMBER()`
- Rolling aggregations
- `CASE WHEN`
- Views
- Indexes
- Data-quality queries

Example use cases include calculating daily returns, rolling volatility, portfolio weights, drawdowns, and benchmark-relative performance.

---

## Power BI Dashboard Plan

The Power BI report is planned to include four main pages:

### 1. Portfolio Overview
- Portfolio value
- Daily P&L
- Total return
- 30-day return
- Volatility
- Maximum drawdown
- Benchmark comparison
- Top and bottom performers

### 2. Security Analytics
- Historical price
- Daily return
- Moving averages
- Rolling volatility
- Drawdown
- Beta
- Trading volume

### 3. Risk & Exposure
- Sector exposure
- Asset-class exposure
- Position weights
- Concentration
- Portfolio beta
- Portfolio volatility

### 4. Data Operations
- Last pipeline run
- Pipeline status
- Records loaded
- Missing records
- Duplicate records
- Failed validation checks
- Latest available trading date

---

## Power Automate Plan

Planned workflows include:

1. **Pipeline Failure Alert**  
   Notify users when an automated data pipeline fails.

2. **Data Quality Alert**  
   Send an alert when missing, duplicate, or invalid records are detected.

3. **Automated Portfolio Report**  
   Distribute scheduled portfolio and risk reports after data refresh.

4. **Portfolio File Processing**  
   Trigger downstream processing when a new portfolio or transaction file is uploaded.

5. **Exception Approval Workflow**  
   Route unusual data or portfolio exceptions for manual approval before processing.

---

## Planned Repository Structure

```text
SQL-project/
|
|-- README.md
|-- requirements.txt
|-- .gitignore
|
|-- data/
|   `-- raw/
|
|-- src/
|   |-- extract.py
|   |-- transform.py
|   |-- load.py
|   `-- validation.py
|
|-- sql/
|   |-- schema.sql
|   |-- staging.sql
|   |-- transformations.sql
|   |-- portfolio_analytics.sql
|   |-- risk_metrics.sql
|   `-- data_quality.sql
|
|-- powerbi/
|   `-- README.md
|
|-- power-automate/
|   `-- README.md
|
|-- tests/
|
`-- run_pipeline.py
```

---

## Development Roadmap

### Phase 1 — Database & SQL
- [ ] Set up PostgreSQL
- [ ] Design the relational schema
- [ ] Create core tables and constraints
- [ ] Load sample market data
- [ ] Write initial SQL analytics

### Phase 2 — Python ETL
- [ ] Build market-data extraction
- [ ] Add transformation and cleaning logic
- [ ] Load data into PostgreSQL
- [ ] Add logging and error handling
- [ ] Add automated data-quality checks

### Phase 3 — Financial Analytics
- [ ] Daily and cumulative returns
- [ ] Portfolio valuation and P&L
- [ ] Rolling volatility
- [ ] Maximum drawdown
- [ ] Beta vs. benchmark
- [ ] Exposure and concentration metrics

### Phase 4 — Power BI
- [ ] Build data model
- [ ] Create portfolio dashboard
- [ ] Create risk dashboard
- [ ] Create data-operations dashboard
- [ ] Add scheduled refresh

### Phase 5 — Power Automate
- [ ] Pipeline failure notifications
- [ ] Data-quality alerts
- [ ] Automated report distribution
- [ ] File-triggered workflow
- [ ] Exception approval workflow

---

## Why This Project

The goal is to combine **financial domain knowledge with practical data engineering and operations skills** rather than build a standalone visualization project.

The finished platform should demonstrate the ability to move from raw financial data to a reliable, automated, analytics-ready system:

**Data ingestion → database design → SQL transformation → financial analytics → visualization → operational automation**

---

## Author

Ethan Wei
