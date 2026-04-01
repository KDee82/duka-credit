# Duka Credit

A digital credit/debt ledger for small East African shop owners — replacing paper debt books with a secure, offline-first mobile app.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npx expo start

# 3. Scan the QR code with Expo Go (Android/iOS)
```

## Project Structure

```
duka-credit/
├── App.js                    # Entry point, DB init, navigation container
├── src/
│   ├── db/
│   │   ├── database.js       # SQLite setup and migrations
│   │   ├── customers.js      # Customer CRUD
│   │   └── transactions.js   # Transaction CRUD + summaries
│   ├── screens/
│   │   ├── HomeScreen.js          # Dashboard
│   │   ├── CustomerListScreen.js  # Searchable customer list
│   │   ├── CustomerDetailScreen.js# Ledger + transaction history
│   │   ├── AddTransactionScreen.js# Credit/payment entry
│   │   └── AddCustomerScreen.js   # New customer form
│   ├── components/
│   │   ├── BalanceCard.js    # Reusable balance display
│   │   ├── TransactionItem.js# Transaction row
│   │   └── CustomerItem.js   # Customer row
│   ├── navigation/
│   │   └── AppNavigator.js   # Bottom tabs + stack navigators
│   └── utils/
│       ├── formatters.js     # KES currency, dates, initials
│       └── constants.js      # Colors, enums
```

## Phase Roadmap

| Phase | Timeline | Focus |
|-------|----------|-------|
| 1 (this build) | Weeks 1–6 | Core ledger, offline SQLite, basic UI |
| 2 | Weeks 7–12 | SMS reminders, reports, multi-user |
| 3 | Weeks 13–18 | M-PESA integration, multi-branch, iOS |

## Tech Stack

- **React Native** (Expo) — Android first
- **expo-sqlite** — offline-first local storage
- **React Navigation** — bottom tabs + stack
- **react-native-paper** — Material UI components
- **@expo/vector-icons** — Ionicons

## Colours

| Token | Hex | Use |
|-------|-----|-----|
| primary | #1E5A9E | Headers, buttons, avatars |
| accent | #27AE60 | Payments, settled, success |
| danger | #E74C3C | Credits owed, overdue |
| background | #F5F7FA | App background |
