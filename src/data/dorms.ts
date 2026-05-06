import dorm1 from "@/assets/dorm-1.jpg";
import dorm2 from "@/assets/dorm-2.jpg";
import dorm3 from "@/assets/dorm-3.jpg";
import dorm4 from "@/assets/dorm-4.jpg";

export type Room = {
  id: string;
  name: string;
  capacity: number;
  occupied: number;
  pricePerBed: number;
  type: "shared" | "private";
  tenants: { id: string; initials: string; name: string }[];
};

export type Dorm = {
  id: string;
  name: string;
  location: string;
  image: string;
  pricePerBed: number;
  rating: number;
  reviews: number;
  available: number;
  total: number;
  amenities: string[];
  description: string;
  rooms: Room[];
};

export const dorms: Dorm[] = [
  {
    id: "northgate",
    name: "Northgate Residences",
    location: "Katipunan Ave., Quezon City",
    image: dorm1,
    pricePerBed: 4200,
    rating: 4.8,
    reviews: 142,
    available: 6,
    total: 24,
    amenities: ["WiFi 500Mbps", "Aircon", "Hot Shower", "24/7 CCTV", "Laundry", "Study Lounge"],
    description:
      "A modern co-living dorm minutes from Ateneo and UP. Designed for focused students with quiet zones, fast internet, and transparent shared billing.",
    rooms: [
      {
        id: "r-201",
        name: "Room 201",
        capacity: 4,
        occupied: 3,
        pricePerBed: 4200,
        type: "shared",
        tenants: [
          { id: "t1", initials: "MR", name: "Maria R." },
          { id: "t2", initials: "JL", name: "Jose L." },
          { id: "t3", initials: "AP", name: "Ana P." },
        ],
      },
      {
        id: "r-202",
        name: "Room 202",
        capacity: 4,
        occupied: 4,
        pricePerBed: 4200,
        type: "shared",
        tenants: [
          { id: "t4", initials: "KD", name: "Kim D." },
          { id: "t5", initials: "RV", name: "Rico V." },
          { id: "t6", initials: "LM", name: "Lia M." },
          { id: "t7", initials: "SF", name: "Sam F." },
        ],
      },
      {
        id: "r-203",
        name: "Room 203",
        capacity: 2,
        occupied: 1,
        pricePerBed: 6500,
        type: "private",
        tenants: [{ id: "t8", initials: "EN", name: "Eli N." }],
      },
      {
        id: "r-204",
        name: "Room 204",
        capacity: 4,
        occupied: 0,
        pricePerBed: 4200,
        type: "shared",
        tenants: [],
      },
      {
        id: "r-301",
        name: "Room 301",
        capacity: 4,
        occupied: 2,
        pricePerBed: 4200,
        type: "shared",
        tenants: [
          { id: "t9", initials: "PJ", name: "Paula J." },
          { id: "t10", initials: "TG", name: "Tom G." },
        ],
      },
      {
        id: "r-302",
        name: "Room 302",
        capacity: 2,
        occupied: 2,
        pricePerBed: 6500,
        type: "private",
        tenants: [
          { id: "t11", initials: "BC", name: "Bea C." },
          { id: "t12", initials: "OD", name: "Owen D." },
        ],
      },
    ],
  },
  {
    id: "heritage",
    name: "Heritage Boarding House",
    location: "España Blvd., Manila",
    image: dorm2,
    pricePerBed: 3500,
    rating: 4.6,
    reviews: 89,
    available: 4,
    total: 16,
    amenities: ["WiFi", "Kitchen", "Laundry", "CCTV"],
    description: "Classic brick boarding house near UST. Affordable, well-maintained, and walkable to campus.",
    rooms: [],
  },
  {
    id: "skyline",
    name: "Skyline Studios",
    location: "Taft Ave., Manila",
    image: dorm3,
    pricePerBed: 7800,
    rating: 4.9,
    reviews: 56,
    available: 2,
    total: 12,
    amenities: ["WiFi 1Gbps", "Aircon", "Private Bath", "Workspace"],
    description: "Premium private studios near DLSU. For students who value privacy and a dedicated workspace.",
    rooms: [],
  },
  {
    id: "commons",
    name: "The Commons",
    location: "Maginhawa St., Quezon City",
    image: dorm4,
    pricePerBed: 3900,
    rating: 4.7,
    reviews: 203,
    available: 8,
    total: 32,
    amenities: ["Lounge", "Library", "WiFi", "Cafeteria", "CCTV"],
    description: "A vibrant co-living community with a generous shared lounge and library.",
    rooms: [],
  },
];