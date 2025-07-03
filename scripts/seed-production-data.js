// Production data seeding script for Firebase
import { collection, addDoc, setDoc, doc, serverTimestamp } from "firebase/firestore"
import { db } from "../lib/firebase.js"

const seedUsers = async () => {
  // Create default admin user
  await setDoc(doc(db, "users", "default-admin"), {
    email: "hyelnamuninathan@gmail.com",
    role: "admin",
    name: "System Administrator",
    department: "IT Administration",
    createdAt: serverTimestamp(),
    isActive: true,
    isDefaultAdmin: true,
  })
  console.log("Created default admin user")

  // Create sample users for testing
  const sampleUsers = [
    {
      id: "staff-demo-1",
      email: "john.doe@company.com",
      name: "John Doe",
      role: "staff",
      department: "Marketing",
      isActive: true,
    },
    {
      id: "staff-demo-2",
      email: "sarah.smith@company.com",
      name: "Sarah Smith",
      role: "staff",
      department: "Design",
      isActive: true,
    },
    {
      id: "tech-demo-1",
      email: "mike.tech@company.com",
      name: "Mike Johnson",
      role: "technician",
      department: "IT Support",
      isActive: true,
    },
  ]

  for (const user of sampleUsers) {
    await setDoc(doc(db, "users", user.id), {
      ...user,
      createdAt: serverTimestamp(),
    })
    console.log(`Created user: ${user.name}`)
  }
}

const seedEquipment = async () => {
  const equipment = [
    {
      name: 'MacBook Pro 16" M2',
      category: "Laptops",
      serialNumber: "MBP-2024-001",
      status: "available",
      condition: "excellent",
      location: "IT Storage Room A",
      description: "High-performance laptop for development and design work",
      specifications: {
        processor: "Apple M2 Pro",
        memory: "32GB Unified Memory",
        storage: "1TB SSD",
        display: "16-inch Liquid Retina XDR",
      },
      lastMaintenance: new Date("2024-01-15"),
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      name: "Dell XPS 13 Plus",
      category: "Laptops",
      serialNumber: "DXP-2024-002",
      status: "available",
      condition: "excellent",
      location: "IT Storage Room A",
      description: "Ultrabook for general office work and presentations",
      specifications: {
        processor: "Intel Core i7-1360P",
        memory: "16GB LPDDR5",
        storage: "512GB SSD",
        display: "13.4-inch FHD+",
      },
      lastMaintenance: new Date("2024-01-10"),
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      name: "Canon EOS R6 Mark II",
      category: "Cameras",
      serialNumber: "CER6-2024-001",
      status: "available",
      condition: "excellent",
      location: "Media Equipment Room",
      description: "Professional mirrorless camera for photography and videography",
      specifications: {
        sensor: "Full-frame CMOS",
        resolution: "24.2 Megapixels",
        video: "4K 60p / Full HD 180p",
        stabilization: "In-body Image Stabilization",
      },
      lastMaintenance: new Date("2024-01-12"),
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      name: "Epson EcoTank ET-4850",
      category: "Printers",
      serialNumber: "EPT-2024-001",
      status: "available",
      condition: "good",
      location: "Office Floor 2 - Copy Center",
      description: "All-in-one printer with cartridge-free printing",
      specifications: {
        type: "4-in-1 Inkjet",
        connectivity: "Wi-Fi, Ethernet, USB",
        features: "Print, Scan, Copy, Fax",
        speed: "15 ppm black, 8 ppm color",
      },
      lastMaintenance: new Date("2024-01-08"),
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      name: "BenQ TK700STi 4K Projector",
      category: "Projectors",
      serialNumber: "BTK-2024-001",
      status: "available",
      condition: "excellent",
      location: "Conference Room A",
      description: "4K short throw projector for presentations and meetings",
      specifications: {
        resolution: "4K UHD (3840x2160)",
        brightness: "3000 ANSI Lumens",
        connectivity: "HDMI, USB-C, Wireless",
        throw: "Short Throw 0.69-0.83",
      },
      lastMaintenance: new Date("2024-01-05"),
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      name: 'iPad Pro 12.9" M2',
      category: "Tablets",
      serialNumber: "IPP-2024-001",
      status: "available",
      condition: "excellent",
      location: "Design Department",
      description: "Professional tablet for design work and digital art",
      specifications: {
        processor: "Apple M2",
        memory: "8GB",
        storage: "256GB",
        display: "12.9-inch Liquid Retina XDR",
      },
      lastMaintenance: new Date("2024-01-18"),
      image: "/placeholder.svg?height=300&width=400",
    },
  ]

  for (const item of equipment) {
    await addDoc(collection(db, "equipment"), {
      ...item,
      createdAt: serverTimestamp(),
    })
    console.log(`Created equipment: ${item.name}`)
  }
}

const seedActivityLogs = async () => {
  const logs = [
    {
      type: "equipment_added",
      message: "New equipment added to inventory",
      details: 'MacBook Pro 16" M2 added by System Administrator',
      userId: "default-admin",
      userName: "System Administrator",
    },
    {
      type: "system_init",
      message: "Office Tools System initialized",
      details: "Production system setup completed",
      userId: "default-admin",
      userName: "System Administrator",
    },
  ]

  for (const log of logs) {
    await addDoc(collection(db, "activityLogs"), {
      ...log,
      timestamp: serverTimestamp(),
    })
    console.log(`Created activity log: ${log.message}`)
  }
}

// Run seeding
const seedDatabase = async () => {
  try {
    console.log("Starting production database seeding...")
    await seedUsers()
    await seedEquipment()
    await seedActivityLogs()
    console.log("Production database seeding completed!")
    console.log("\n🎉 Your Office Tools System is ready!")
    console.log("📧 Default admin: hyelnamuninathan@gmail.com")
    console.log("🔐 Create your admin password by signing up with this email")
  } catch (error) {
    console.error("Error seeding database:", error)
  }
}

seedDatabase()
