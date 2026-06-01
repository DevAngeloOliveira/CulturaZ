export type PublicStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type BuyerTabParamList = {
  HomeTab: undefined;
  SearchTab: undefined;
  SellTab: undefined;
  OrdersTab: undefined;
  ProfileTab: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  BookDetails: { listingId: string };
  Favorites: undefined;
  Cart: undefined;
  Checkout: undefined;
  OrderDetails: { orderId: string };
  Review: { orderId: string; sellerId: string };
};

export type SearchStackParamList = {
  Catalog: undefined;
  BookDetails: { listingId: string };
  Filters: undefined;
};

export type OrdersStackParamList = {
  MyOrders: undefined;
  OrderDetails: { orderId: string };
  Review: { orderId: string; sellerId: string };
};

export type ProfileStackParamList = {
  Profile: undefined;
  Addresses: undefined;
};

export type SellerDashboardStackParamList = {
  Dashboard: undefined;
  Reputation: undefined;
};

export type SellerListingsStackParamList = {
  MyListings: undefined;
  CreateListing: undefined;
};

export type SellerOrdersStackParamList = {
  SellerOrders: undefined;
  SellerOrderDetails: { orderId: string };
};

export type AdminDashboardStackParamList = {
  Dashboard: undefined;
  AdminOrders: undefined;
  AdminOrderDetails: { orderId: string };
};

export type SellerTabParamList = {
  DashboardTab: undefined;
  ListingsTab: undefined;
  OrdersTab: undefined;
  ReportsTab: undefined;
};

export type AdminTabParamList = {
  DashboardTab: undefined;
  UsersTab: undefined;
  ModerationTab: undefined;
  CategoriesTab: undefined;
  ReportsTab: undefined;
};
