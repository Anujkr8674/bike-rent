import { siteAssets } from "@/lib/site-assets";

export type BikeItem = {
  id: string;
  name: string;
  brand: string;
  cc: number;
  mileage: number;
  color?: string;
  fuelType: "Petrol" | "Electric";
  transmission: "Manual" | "Automatic";
  rating: number;
  pricePerDay: number;
  pricePerHour: number;
  image: string;
  gallery?: string[];
  city: "Ranchi";
  category: string;
};

export const ranchiBikes: BikeItem[] = [
  { id: "pulsar-150", name: "Pulsar 150", brand: "Bajaj", cc: 149, mileage: 45, fuelType: "Petrol", transmission: "Manual", rating: 4.7, pricePerDay: 699, pricePerHour: 99, image: siteAssets.bikes.pulsar150, city: "Ranchi", category: "Commuter" },
  { id: "pulsar-ns200", name: "Pulsar NS200", brand: "Bajaj", cc: 199, mileage: 38, fuelType: "Petrol", transmission: "Manual", rating: 4.8, pricePerDay: 999, pricePerHour: 149, image: siteAssets.bikes.pulsarNs200, city: "Ranchi", category: "Sports" },
  { id: "apache-rtr", name: "Apache RTR", brand: "TVS", cc: 160, mileage: 42, fuelType: "Petrol", transmission: "Manual", rating: 4.6, pricePerDay: 799, pricePerHour: 119, image: siteAssets.bikes.apacheRtr, city: "Ranchi", category: "Sports" },
  { id: "ktm-duke", name: "KTM Duke", brand: "KTM", cc: 200, mileage: 34, fuelType: "Petrol", transmission: "Manual", rating: 4.9, pricePerDay: 1299, pricePerHour: 189, image: siteAssets.bikes.ktmDuke, city: "Ranchi", category: "Sports" },
  { id: "r15", name: "R15", brand: "Yamaha", cc: 155, mileage: 40, fuelType: "Petrol", transmission: "Manual", rating: 4.8, pricePerDay: 1199, pricePerHour: 179, image: siteAssets.bikes.r15, city: "Ranchi", category: "Sports" },
  { id: "mt15", name: "MT15", brand: "Yamaha", cc: 155, mileage: 45, fuelType: "Petrol", transmission: "Manual", rating: 4.7, pricePerDay: 1099, pricePerHour: 169, image: siteAssets.bikes.mt15, city: "Ranchi", category: "Sports" },
  { id: "classic-350", name: "Royal Enfield Classic 350", brand: "Royal Enfield", cc: 349, mileage: 34, fuelType: "Petrol", transmission: "Manual", rating: 4.9, pricePerDay: 1499, pricePerHour: 229, image: siteAssets.bikes.classic350, city: "Ranchi", category: "Cruiser" },
  { id: "hunter-350", name: "Hunter 350", brand: "Royal Enfield", cc: 349, mileage: 36, fuelType: "Petrol", transmission: "Manual", rating: 4.7, pricePerDay: 1399, pricePerHour: 209, image: siteAssets.bikes.hunter350, city: "Ranchi", category: "Cruiser" },
  { id: "activa", name: "Activa", brand: "Honda", cc: 110, mileage: 50, fuelType: "Petrol", transmission: "Automatic", rating: 4.5, pricePerDay: 549, pricePerHour: 79, image: siteAssets.bikes.activa, city: "Ranchi", category: "Scooter" },
  { id: "jupiter", name: "Jupiter", brand: "TVS", cc: 110, mileage: 52, fuelType: "Petrol", transmission: "Automatic", rating: 4.4, pricePerDay: 499, pricePerHour: 75, image: siteAssets.bikes.jupiter, city: "Ranchi", category: "Scooter" },
  { id: "access-125", name: "Access 125", brand: "Suzuki", cc: 125, mileage: 49, fuelType: "Petrol", transmission: "Automatic", rating: 4.6, pricePerDay: 599, pricePerHour: 89, image: siteAssets.bikes.access125, city: "Ranchi", category: "Scooter" },
  { id: "ntorq", name: "Ntorq", brand: "TVS", cc: 125, mileage: 45, fuelType: "Petrol", transmission: "Automatic", rating: 4.6, pricePerDay: 649, pricePerHour: 95, image: siteAssets.bikes.ntorq, city: "Ranchi", category: "Scooter" },
];
