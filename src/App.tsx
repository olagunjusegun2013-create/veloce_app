import React, { useState } from 'react';
import { 
  CurrencyAccount, 
  Transaction, 
  Card, 
  Beneficiary, 
  NotificationItem, 
  CurrencyCode 
} from './types';
import { 
  INITIAL_ACCOUNTS, 
  INITIAL_CARDS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_BENEFICIARIES, 
  INITIAL_NOTIFICATIONS 
} from './data/mockData';
import { Sidebar, NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { MobileNav } from './components/MobileNav';
import { SendMoneyModal } from './components/SendMoneyModal';
import { ExchangeModal } from './components/ExchangeModal';
import { NewCardModal } from './components/NewCardModal';
import { DashboardView } from './views/DashboardView';
import { TransfersView } from './views/TransfersView';
import { VaultsView } from './views/VaultsView';
import { CardsView } from './views/CardsView';
import { AnalyticsView } from './views/AnalyticsView';
import { SettingsView } from './views/SettingsView';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [displayCurrency, setDisplayCurrency] = useState<CurrencyCode>('USD');

  // Application State
  const [accounts, setAccounts] = useState<CurrencyAccount[]>(INITIAL_ACCOUNTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [cards, setCards] = useState<Card[]>(INITIAL_CARDS);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(INITIAL_BENEFICIARIES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Modals
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [isExchangeOpen, setIsExchangeOpen] = useState(false);
  const [isNewCardOpen, setIsNewCardOpen] = useState(false);

  // Handlers
  const handleExecuteTransfer = (newTx: Transaction, updatedAccounts: CurrencyAccount[]) => {
    setTransactions((prev) => [newTx, ...prev]);
    setAccounts(updatedAccounts);

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Outbound Transfer Dispatched',
      description: `${newTx.currency} ${Math.abs(newTx.amount).toLocaleString()} sent to ${newTx.merchantOrBeneficiary}`,
      time: 'Just now',
      type: 'transaction',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleExecuteExchange = (newTx: Transaction, updatedAccounts: CurrencyAccount[]) => {
    setTransactions((prev) => [newTx, ...prev]);
    setAccounts(updatedAccounts);

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'FX Vault Rebalance Settled',
      description: newTx.note || 'Zero-markup conversion completed',
      time: 'Just now',
      type: 'transaction',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleToggleFreezeCard = (cardId: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, isFrozen: !c.isFrozen } : c))
    );
  };

  const handleUpdateSpendLimit = (cardId: string, newLimit: number) => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, spendLimit: newLimit } : c))
    );
  };

  const handleCreateCard = (newCard: Card) => {
    setCards((prev) => [newCard, ...prev]);
  };

  const handleAddBeneficiary = (b: Beneficiary) => {
    setBeneficiaries((prev) => [b, ...prev]);
  };

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F5F7FB] text-[#101A35]">
      {/* Desktop / Tablet Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header
          notifications={notifications}
          onMarkNotificationAsRead={handleMarkNotificationAsRead}
          selectedDisplayCurrency={displayCurrency}
          onChangeDisplayCurrency={setDisplayCurrency}
          onOpenSendModal={() => setIsSendOpen(true)}
        />

        {/* Scrollable Viewport Pane */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 pt-6 sm:pt-8">
          <div className="max-w-[1240px] mx-auto w-full">
            {currentTab === 'dashboard' && (
              <DashboardView
                accounts={accounts}
                transactions={transactions}
                cards={cards}
                beneficiaries={beneficiaries}
                onOpenSendModal={() => setIsSendOpen(true)}
                onOpenExchangeModal={() => setIsExchangeOpen(true)}
                onOpenNewCardModal={() => setIsNewCardOpen(true)}
                onToggleFreezeCard={handleToggleFreezeCard}
                onNavigateTab={setCurrentTab}
              />
            )}

            {currentTab === 'transfers' && (
              <TransfersView
                transactions={transactions}
                beneficiaries={beneficiaries}
                accounts={accounts}
                onOpenSendModal={() => setIsSendOpen(true)}
                onAddBeneficiary={handleAddBeneficiary}
              />
            )}

            {currentTab === 'vaults' && (
              <VaultsView
                accounts={accounts}
                onOpenExchangeModal={() => setIsExchangeOpen(true)}
              />
            )}

            {currentTab === 'cards' && (
              <CardsView
                cards={cards}
                transactions={transactions}
                onToggleFreeze={handleToggleFreezeCard}
                onOpenNewCardModal={() => setIsNewCardOpen(true)}
                onUpdateSpendLimit={handleUpdateSpendLimit}
              />
            )}

            {currentTab === 'analytics' && (
              <AnalyticsView
                transactions={transactions}
                accounts={accounts}
              />
            )}

            {currentTab === 'settings' && (
              <SettingsView />
            )}
          </div>
        </main>

        {/* Mobile Glassmorphic Bottom Dock Navigation */}
        <MobileNav
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
        />
      </div>

      {/* Global Action Modals */}
      <SendMoneyModal
        isOpen={isSendOpen}
        onClose={() => setIsSendOpen(false)}
        accounts={accounts}
        beneficiaries={beneficiaries}
        onExecuteTransfer={handleExecuteTransfer}
      />

      <ExchangeModal
        isOpen={isExchangeOpen}
        onClose={() => setIsExchangeOpen(false)}
        accounts={accounts}
        onExecuteExchange={handleExecuteExchange}
      />

      <NewCardModal
        isOpen={isNewCardOpen}
        onClose={() => setIsNewCardOpen(false)}
        onCardCreated={handleCreateCard}
      />
    </div>
  );
}
