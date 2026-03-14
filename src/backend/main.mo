import Array "mo:core/Array";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Char "mo:core/Char";

actor {
  // Data Types
  type Member = {
    id : Text;
    name : Text;
    mobile : Text;
    address : Text;
    districtId : Text;
    unionId : Text;
    assemblyId : Text;
    memberId : Text;
    createdAt : Time.Time;
  };

  module Member {
    public func compare(member1 : Member, member2 : Member) : Order.Order {
      switch (Text.compare(member1.name, member2.name)) {
        case (#equal) { Text.compare(member1.memberId, member2.memberId) };
	      case (order) { order };
      };
    };
  };

  type DropdownOption = {
    id : Text;
    text : Text;
    category : Text;
  };

  module DropdownOption {
    public func compareByCategory(option1 : DropdownOption, option2 : DropdownOption) : Order.Order {
      Text.compare(option1.category, option2.category);
    };
  };

  // Persistent State
  let memberStore = Map.empty<Text, Member>();
  let dropdownStore = Map.empty<Text, DropdownOption>();

  // Helper Functions
  func toLowerText(t : Text) : Text {
    t.map(
      func(c) {
        if (c >= 'A' and c <= 'Z') {
          Char.fromNat32(c.toNat32() + 32);
        } else {
          c;
        };
      }
    );
  };

  // Actor Methods
  public shared ({ caller }) func addMember(
    name : Text,
    mobile : Text,
    address : Text,
    districtId : Text,
    unionId : Text,
    assemblyId : Text,
    memberId : Text,
  ) : async Member {
    let id = Time.now().toText();
    let member : Member = {
      id;
      name;
      mobile;
      address;
      districtId;
      unionId;
      assemblyId;
      memberId;
      createdAt = Time.now();
    };
    memberStore.add(id, member);
    member;
  };

  public query ({ caller }) func getMembers() : async [Member] {
    memberStore.values().toArray().sort();
  };

  public query ({ caller }) func searchMembers(searchQuery : Text, field : Text) : async [Member] {
    memberStore.values().toArray().filter(
      func(member) {
        switch (field) {
          case ("name") {
            toLowerText(member.name).contains(#text(toLowerText(searchQuery)));
          };
          case ("memberId") {
            member.memberId.contains(#text(searchQuery));
          };
          case ("assembly") {
            member.assemblyId.contains(#text(searchQuery));
          };
          case (_) { false };
        };
      }
    );
  };

  public shared ({ caller }) func addDropdownOption(text : Text, category : Text) : async DropdownOption {
    let id = text.concat(category);
    let dropdown : DropdownOption = {
      id;
      text;
      category;
    };
    dropdownStore.add(id, dropdown);
    dropdown;
  };

  public shared ({ caller }) func updateDropdownOption(id : Text, text : Text) : async ?DropdownOption {
    switch (dropdownStore.get(id)) {
      case (null) { null };
      case (?current) {
        let updated : DropdownOption = {
          id;
          text;
          category = current.category;
        };
        dropdownStore.add(id, updated);
        ?updated;
      };
    };
  };

  public shared ({ caller }) func deleteDropdownOption(id : Text) : async Bool {
    let existed = dropdownStore.containsKey(id);
    dropdownStore.remove(id);
    existed;
  };

  public query ({ caller }) func getDropdownOptions(category : Text) : async [DropdownOption] {
    dropdownStore.values().toArray().filter(
      func(option) { option.category == category }
    );
  };

  // Seed initial dropdown options
  public shared ({ caller }) func seedInitialData() : async () {
    let districts = ["Dhaka", "Chittagong", "Khulna"];
    let unions = ["Union1", "Union2"];
    let assemblies = ["AssemblyA", "AssemblyB"];

    for (d in districts.values()) {
      let option : DropdownOption = {
        id = d.concat("district");
        text = d;
        category = "district";
      };
      dropdownStore.add(option.id, option);
    };

    for (u in unions.values()) {
      let option : DropdownOption = {
        id = u.concat("union");
        text = u;
        category = "union";
      };
      dropdownStore.add(option.id, option);
    };

    for (a in assemblies.values()) {
      let option : DropdownOption = {
        id = a.concat("assembly");
        text = a;
        category = "assembly";
      };
      dropdownStore.add(option.id, option);
    };
  };
};
