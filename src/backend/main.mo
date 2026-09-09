import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

// Actor containing the core application logic, using the migration function via the with-clause.

actor {
  // Type for valve name
  type ValveName = Text;

  // Valve entry containing open/closed state
  type ValveEntry = {
    isOpen : Bool;
  };

  // Valve state management
  func addValveEntryIfMissing(valveEntries : Map.Map<ValveName, ValveEntry>, valveName : ValveName) {
    if (not valveEntries.containsKey(valveName)) {
      let entry : ValveEntry = { isOpen = false };
      valveEntries.add(valveName, entry);
    };
  };

  // Enum for alert severity levels
  type AlertSeverity = {
    #high;
    #medium;
    #low;
  };

  // Alert state management
  type AlertEntry = {
    message : Text;
    severity : AlertSeverity;
    isAcknowledged : Bool;
  };

  // Ensure persistent valve state: Current state is persisted, new valves are added as new entries.
  func persistValveStateInternal(valveEntries : Map.Map<ValveName, ValveEntry>, valveState : [(ValveName, Bool)]) {
    for ((name, isOpen) in valveState.values()) {
      // Explicit update or create valve entry
      let newEntry = { isOpen };
      valveEntries.add(name, newEntry);
    };
  };

  type HydrotechUserProfile = {
    displayName : Text;
    email : Text;
    customWebId : Text;
  };

  type ShopOrder = {
    productName : Text;
    quantity : Nat;
    price : Nat;
  };

  type ServiceBooking = {
    technicianName : Text;
    bookingDate : Time.Time;
    notes : Text;
  };

  /// Store references with persistent maps.
  let valveEntries = Map.empty<ValveName, ValveEntry>();
  let shopOrders = Map.empty<Principal, [ShopOrder]>();
  let alerts = Map.empty<Nat, AlertEntry>();
  let userProfiles = Map.empty<Principal, HydrotechUserProfile>();
  let serviceBookings = Map.empty<Principal, [ServiceBooking]>();

  // Last alert ID for persistent alert management
  var lastAlertId = 0;

  // New access control state is persisted
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // New controller can at all times clear the complete persisted state for safety via a dedicated function.
  public shared ({ caller }) func clearPersistentState() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can clear persistent state");
    };
    valveEntries.clear();
    alerts.clear();
    shopOrders.clear();
    serviceBookings.clear();
  };

  // Persistent state management for the valve state.
  // The overall state may feature up to 8 entries. New entries are added, entries no longer present are persisted for backward compatibility.
  public shared ({ caller }) func persistValveState(valveState : [(ValveName, Bool)]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can persist valve state");
    };
    persistValveStateInternal(valveEntries, valveState);
  };

  // Persistent state management for user profile
  public shared ({ caller }) func saveCallerUserProfile(profile : HydrotechUserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Get caller's own profile
  public query ({ caller }) func getCallerUserProfile() : async ?HydrotechUserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  // Get any user's profile (admin can view all, users can view their own)
  public query ({ caller }) func getUserProfile(user : Principal) : async ?HydrotechUserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // Persistent state management for alert entries.
  public shared ({ caller }) func createPersistentAlert(alert : AlertEntry) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create alerts");
    };
    lastAlertId += 1;
    alerts.add(lastAlertId, alert);
    lastAlertId;
  };

  // Get all alerts
  public query ({ caller }) func getAlerts() : async [(Nat, AlertEntry)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view alerts");
    };
    alerts.entries().toArray();
  };

  // Mark alert as acknowledged
  public shared ({ caller }) func acknowledgeAlert(alertId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can acknowledge alerts");
    };
    switch (alerts.get(alertId)) {
      case (?alert) {
        let updatedAlert = {
          message = alert.message;
          severity = alert.severity;
          isAcknowledged = true;
        };
        alerts.add(alertId, updatedAlert);
      };
      case (null) {
        Runtime.trap("Alert not found");
      };
    };
  };

  // Persistent state management for shop orders.
  public shared ({ caller }) func submitPersistentShopOrder(order : ShopOrder) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit shop orders");
    };
    let existingOrders = switch (shopOrders.get(caller)) {
      case (?orders) { orders };
      case (null) { [] };
    };
    let newOrders = existingOrders.concat([order]);
    shopOrders.add(caller, newOrders);
  };

  // Get caller's shop orders
  public query ({ caller }) func getCallerShopOrders() : async [ShopOrder] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view shop orders");
    };
    switch (shopOrders.get(caller)) {
      case (?orders) { orders };
      case (null) { [] };
    };
  };

  // Persistent state management for service bookings.
  public shared ({ caller }) func addPersistentServiceBooking(booking : ServiceBooking) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add service bookings");
    };
    let existingBookings = switch (serviceBookings.get(caller)) {
      case (?bookings) { bookings };
      case (null) { [] };
    };
    let newBookings = existingBookings.concat([booking]);
    serviceBookings.add(caller, newBookings);
  };

  // Get caller's service bookings
  public query ({ caller }) func getCallerServiceBookings() : async [ServiceBooking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view service bookings");
    };
    switch (serviceBookings.get(caller)) {
      case (?bookings) { bookings };
      case (null) { [] };
    };
  };

  // Persistent state: Valve state is persisted as nat, since the device originally persists it in such a format.
  // 0 = all valves closed
  // 1 = valve 1 open
  // 2 = valve 2 open
  // 4 = valve 3 open
  // 8 = valve 4 open
  // 16 = valve 5 open
  // 32 = valve 6 open
  // 64 = valve 7 open
  // 128 = valve 8 open
  // 3 = valve 1 and 2 open
  // 255 = all valves open
  // etc.
  public query ({ caller }) func getPersistentValveState() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view valve state");
    };
    // Convert valve entries to bit representation
    var state : Nat = 0;
    for (i in Nat.range(0, 8)) {
      let valveName = "valve" # (i + 1).toText();
      switch (valveEntries.get(valveName)) {
        case (?entry) {
          if (entry.isOpen) {
            state := state + (2 ** i);
          };
        };
        case (null) {};
      };
    };
    state;
  };

  // Persistent state: Set valve state, overwriting persisted state. Called once at start or in reset.
  public shared ({ caller }) func setPersistentValveState(valveState : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can set valve state");
    };
    // Convert bit representation to valve entries
    for (i in Nat.range(0, 8)) {
      let valveName = "valve" # (i + 1).toText();
      let bitMask = 2 ** i;
      let isOpen = (valveState / bitMask) % 2 == 1;
      let entry : ValveEntry = { isOpen };
      valveEntries.add(valveName, entry);
    };
  };
};
