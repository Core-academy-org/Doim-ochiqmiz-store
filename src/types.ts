export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  mapUrl?: string;
  workingHours?: string;
  createdAt?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  branchId: string;
  branchName?: string;
  imageUrl: string;
  images?: string[];
  description?: string;
  category?: string;
  reactions?: Record<string, number>;
  createdAt?: string;
}

export interface SiteSettings {
  siteTitle: string;
  siteSubtitle: string;
  contactPhone: string;
  heroNotice: string;
  workingHoursNotice: string;
  headerTagline: string;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  date: string;
  createdAt?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'admin';
  text: string;
  timestamp: any;
  senderName?: string;
}

export interface ChatSession {
  id: string;
  customerName: string;
  customerPhone: string;
  contactReason: string;
  status: 'active' | 'closed';
  unreadByAdmin: boolean;
  lastMessage: string;
  lastUpdated: any;
  createdAt: any;
}
