export const en = {
  // Header
  'header.about': 'About',
  'header.info': 'Info',

  // Info modal
  'info.title': 'How2split',
  'info.close': 'Close',
  'info.step1': '1. Enter members and create an event',
  'info.step2': '2. Remember and share the event link',
  'info.step3': '3. Start logging expenses!',
  'info.step4': '4. Tap an entry to see details.',
  'info.warning': '⚠️ Anyone with the link can edit the event. Do not share with people you don’t trust.',

  // Select
  'select.placeholder': 'Select',

  // Create
  'create.title': 'Create event',
  'create.eventNamePlaceholder': 'Event name',
  'create.memberPlaceholder': 'Member name',
  'create.addMember': 'Add member',
  'create.delete': 'Delete',
  'create.hint': '*Members cannot be removed after the event is created*',
  'create.submit': 'Create event',
  'create.creating': 'Creating…',

  // Toasts
  'toast.duplicateMember': 'Duplicate member name',
  'toast.createEventFailed': 'Failed to create event',
  'toast.entryAdded': 'Entry added',
  'toast.entryUpdated': 'Entry updated',
  'toast.entryDeleted': 'Entry deleted',
  'toast.transferAdded': 'Transfer added',
  'toast.transferUpdated': 'Transfer updated',
  'toast.settleAdded': 'Settle transfer added',
  'toast.linkCopied': 'Link copied to clipboard',
  'toast.duplicateMemberEvent': 'Duplicate member name',

  // About
  'about.title': 'About',
  'about.intro':
    'How2split is a minimal expense-splitting tool. No app install, no sign-up—create an event, share the link, and start splitting.',
  'about.credits':
    'Designed and built by {{author}}. Inspired by When2meet’s keep-it-simple approach. Feedback welcome via {{form}}.',
  'about.form': 'this form',
  'about.support': 'You can support the project via {{bmc}}.',
  'about.bmc': 'Buy Me A Coffee',
  'about.thanks': 'Thank you!',
  'about.roadmap':
    'Coming: (1) Multi-payer (2) History (3) Private encrypted events (4) Remove members & debt handling (5) More languages (6) Categories (7) Stats & charts (8) Multi-currency (9) Custom event links (10) Delete event',

  // Error
  'error.notFound': 'Page not found',

  // Event
  'event.editEvent': 'Edit event',
  'event.copyLink': 'Share link',
  'event.addExpense': 'Add expense',
  'event.addTransfer': 'Add transfer',
  'event.settle': 'Settle',
  'event.settling': 'Settling…',
  'event.hideSettle': 'Hide settlement',
  'event.noSettle': 'All settled 🎉',
  'event.settleClear': 'Settle',
  'event.settleConfirmTitle': 'Confirm transfer',
  'event.settleConfirmMessage': 'Add this transfer to clear the debt?',
  'event.settleConfirmOk': 'Confirm',
  'event.deleteTitle': 'Delete entry',
  'event.deleteMessage': 'Are you sure you want to delete this entry?',
  'event.deleteOk': 'Delete',
  'event.cancel': 'Cancel',
  'event.expenseLine': '{{name}} paid by {{payer}} {{value}}',
  'event.transferLine': '{{payer}} → {{receiver}} {{value}}',
  'event.settleLine': '{{debtor}} owes {{creditor}} {{amount}}',
  'event.shareLine': '{{member}} {{amount}}',
  'event.methodEqual': 'Split equally',
  'event.methodCustom': 'Custom amounts',
  'event.yuan': '',
  'event.yuanSuffix': '',

  // AddEntry / EditEntry
  'entry.titleAdd': 'Add expense',
  'entry.titleEdit': 'Edit expense',
  'entry.close': 'Close',
  'entry.entryName': 'Item',
  'entry.entryNamePlaceholder': 'Item name',
  'entry.amount': 'Amount',
  'entry.amountPlaceholder': 'Amount',
  'entry.payer': 'Payer',
  'entry.payerPlaceholder': 'Payer',
  'entry.method': 'Split by',
  'entry.splitEqual': 'Split equally',
  'entry.splitCustom': 'Custom amounts',
  'entry.checkAll': 'Select all',
  'entry.remaining': 'Remaining',
  'entry.submit': 'Add expense',
  'entry.save': 'Save',
  'entry.submitting': 'Adding…',

  // AddTrans / EditTrans
  'trans.titleAdd': 'Add transfer',
  'trans.titleEdit': 'Edit transfer',
  'trans.close': 'Close',
  'trans.payer': 'Payer',
  'trans.payerPlaceholder': 'Payer',
  'trans.amount': 'Amount',
  'trans.amountPlaceholder': 'Amount',
  'trans.receiver': 'Receiver',
  'trans.receiverPlaceholder': 'Receiver',
  'trans.submit': 'Add transfer',
  'trans.save': 'Save',
  'trans.submitting': 'Adding…',

  // EditEvent
  'editEvent.title': 'Edit event',
  'editEvent.close': 'Close (save)',
  'editEvent.eventNamePlaceholder': 'Event name',
  'editEvent.memberPlaceholder': 'Member name',
  'editEvent.addMember': 'Add member',
  'editEvent.hint': '*Saving on close; existing members cannot be removed*',
  'editEvent.delete': 'Delete',
} as const;

export type LocaleKey = keyof typeof en;
