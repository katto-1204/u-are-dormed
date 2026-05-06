export type Message = {
  id: string;
  from: "me" | "them";
  text: string;
  time: string;
};

export type Thread = {
  id: string;
  name: string;
  initials: string;
  role: "tenant" | "landlord";
  room?: string;
  preview: string;
  lastTime: string;
  unread: number;
  online?: boolean;
  messages: Message[];
};

const m = (id: string, from: Message["from"], text: string, time: string): Message => ({
  id,
  from,
  text,
  time,
});

/* Threads from a tenant POV (counterparts are landlords/staff) */
export const tenantThreads: Thread[] = [
  {
    id: "th-1",
    name: "Jose Dela Cruz",
    initials: "JD",
    role: "landlord",
    room: "Northgate · Landlord",
    preview: "Sure, I'll have maintenance check the aircon tomorrow morning.",
    lastTime: "2m",
    unread: 2,
    online: true,
    messages: [
      m("1", "me", "Hi! The aircon in Room 201 is making a clicking sound.", "10:02"),
      m("2", "them", "Thanks for letting me know — when did it start?", "10:04"),
      m("3", "me", "Last night around 11pm.", "10:05"),
      m("4", "them", "Sure, I'll have maintenance check the aircon tomorrow morning.", "10:06"),
    ],
  },
  {
    id: "th-2",
    name: "Northgate Front Desk",
    initials: "ND",
    role: "landlord",
    room: "Reception",
    preview: "Your package from Lazada has arrived.",
    lastTime: "1h",
    unread: 1,
    messages: [
      m("1", "them", "Your package from Lazada has arrived.", "09:00"),
      m("2", "them", "Please pick it up at the lobby.", "09:00"),
    ],
  },
  {
    id: "th-3",
    name: "Billing",
    initials: "BL",
    role: "landlord",
    room: "Automated",
    preview: "Your November invoice is ready: ₱4,956 due Nov 30.",
    lastTime: "Yesterday",
    unread: 0,
    messages: [m("1", "them", "Your November invoice is ready: ₱4,956 due Nov 30.", "Yesterday")],
  },
];

/* Threads from a landlord POV (counterparts are tenants) */
export const landlordThreads: Thread[] = [
  {
    id: "lt-1",
    name: "Maria R.",
    initials: "MR",
    role: "tenant",
    room: "Room 201",
    preview: "Got it, thanks for the quick response!",
    lastTime: "2m",
    unread: 3,
    online: true,
    messages: [
      m("1", "them", "Hi! The aircon in Room 201 is making a clicking sound.", "10:02"),
      m("2", "me", "Thanks for letting me know — when did it start?", "10:04"),
      m("3", "them", "Last night around 11pm.", "10:05"),
      m("4", "me", "Sure, I'll have maintenance check it tomorrow morning.", "10:06"),
      m("5", "them", "Got it, thanks for the quick response!", "10:08"),
    ],
  },
  {
    id: "lt-2",
    name: "Kim D.",
    initials: "KD",
    role: "tenant",
    room: "Room 202",
    preview: "Can I pay half now and the rest next week?",
    lastTime: "30m",
    unread: 1,
    messages: [m("1", "them", "Can I pay half now and the rest next week?", "11:20")],
  },
  {
    id: "lt-3",
    name: "Eli N.",
    initials: "EN",
    role: "tenant",
    room: "Room 203",
    preview: "I just uploaded my signed lease, please confirm.",
    lastTime: "3h",
    unread: 0,
    messages: [m("1", "them", "I just uploaded my signed lease, please confirm.", "08:45")],
  },
  {
    id: "lt-4",
    name: "Bea C.",
    initials: "BC",
    role: "tenant",
    room: "Room 302",
    preview: "Thanks for the reminder — paying tonight.",
    lastTime: "Yesterday",
    unread: 0,
    messages: [m("1", "them", "Thanks for the reminder — paying tonight.", "Yesterday")],
  },
  {
    id: "lt-5",
    name: "Owen D.",
    initials: "OD",
    role: "tenant",
    room: "Room 302",
    preview: "Wifi has been down on the 3rd floor.",
    lastTime: "2d",
    unread: 0,
    messages: [m("1", "them", "Wifi has been down on the 3rd floor.", "2d ago")],
  },
];