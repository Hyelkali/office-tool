import { supabase } from "../src/lib/supabase.js"

const seedData = async () => {
  try {
    console.log("🌱 Starting database seeding...")

    // Seed demo users
    const users = [
      {
        id: "550e8400-e29b-41d4-a716-446655440000",
        email: "hyelnamuninathan@gmail.com",
        name: "Admin User",
        role: "admin",
        department: "IT Administration",
        phone: "+1234567890",
        position: "System Administrator",
        is_active: true,
        is_default_admin: true,
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440001",
        email: "staff@demo.com",
        name: "John Smith",
        role: "staff",
        department: "Marketing",
        phone: "+1234567891",
        position: "Marketing Manager",
        is_active: true,
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440002",
        email: "tech@demo.com",
        name: "Jane Doe",
        role: "technician",
        department: "IT Support",
        phone: "+1234567892",
        position: "IT Technician",
        is_active: true,
      },
    ]

    const { error: usersError } = await supabase.from("users").upsert(users, { onConflict: "email" })

    if (usersError) {
      console.error("Error seeding users:", usersError)
    } else {
      console.log("✅ Users seeded successfully")
    }

    // Seed demo equipment
    const equipment = [
      {
        name: 'MacBook Pro 16"',
        serial_number: "MBP-001-2024",
        category: "laptop",
        description: "High-performance laptop for development work",
        location: "IT Storage Room",
        status: "available",
        condition: "excellent",
        purchase_price: 2499.99,
        vendor: "Apple Inc.",
        purchase_date: "2024-01-15",
        warranty_expiry: "2027-01-15",
        specifications: "M3 Pro chip, 18GB RAM, 512GB SSD, 16-inch Liquid Retina XDR display",
      },
      {
        name: "Dell XPS 13",
        serial_number: "DELL-XPS-002",
        category: "laptop",
        description: "Ultrabook for general office work",
        location: "Office 201",
        status: "in-use",
        condition: "good",
        purchase_price: 1299.99,
        vendor: "Dell Technologies",
        purchase_date: "2023-08-20",
        warranty_expiry: "2026-08-20",
        assigned_to: "John Smith",
        specifications: "13th Gen Intel Core i7, 16GB RAM, 512GB SSD, 13.4-inch FHD+ display",
      },
      {
        name: "HP LaserJet Pro",
        serial_number: "HP-LJ-003",
        category: "printer",
        description: "Black and white laser printer",
        location: "Main Office",
        status: "available",
        condition: "good",
        purchase_price: 299.99,
        vendor: "HP Inc.",
        purchase_date: "2023-05-10",
        warranty_expiry: "2025-05-10",
        specifications: "Monochrome laser, 28 ppm, 1200 x 1200 dpi, USB/Ethernet",
      },
      {
        name: "LG UltraWide Monitor",
        serial_number: "LG-UW-004",
        category: "monitor",
        description: "34-inch ultrawide monitor",
        location: "Conference Room A",
        status: "available",
        condition: "excellent",
        purchase_price: 599.99,
        vendor: "LG Electronics",
        purchase_date: "2024-02-01",
        warranty_expiry: "2027-02-01",
        specifications: "34-inch, 3440x1440, IPS, 75Hz, USB-C, HDR10",
      },
      {
        name: 'iPad Pro 12.9"',
        serial_number: "IPAD-PRO-005",
        category: "tablet",
        description: "Professional tablet for presentations",
        location: "Marketing Department",
        status: "maintenance",
        condition: "fair",
        purchase_price: 1099.99,
        vendor: "Apple Inc.",
        purchase_date: "2023-03-15",
        warranty_expiry: "2025-03-15",
        specifications: "M2 chip, 128GB, 12.9-inch Liquid Retina XDR, Apple Pencil compatible",
      },
      {
        name: "iPhone 15 Pro",
        serial_number: "IPHONE-15-006",
        category: "phone",
        description: "Company phone for executives",
        location: "Executive Office",
        status: "in-use",
        condition: "excellent",
        purchase_price: 999.99,
        vendor: "Apple Inc.",
        purchase_date: "2024-01-01",
        warranty_expiry: "2025-01-01",
        assigned_to: "Admin User",
        specifications: "A17 Pro chip, 256GB, 6.1-inch Super Retina XDR, Pro camera system",
      },
    ]

    const { error: equipmentError } = await supabase
      .from("equipment")
      .upsert(equipment, { onConflict: "serial_number" })

    if (equipmentError) {
      console.error("Error seeding equipment:", equipmentError)
    } else {
      console.log("✅ Equipment seeded successfully")
    }

    // Seed demo requests
    const requests = [
      {
        user_id: "550e8400-e29b-41d4-a716-446655440001",
        equipment_id: (await supabase.from("equipment").select("id").eq("serial_number", "MBP-001-2024").single()).data
          ?.id,
        purpose: "Development work for new project",
        start_date: "2024-01-20",
        end_date: "2024-02-20",
        status: "pending",
        notes: "Need high-performance laptop for React development",
      },
      {
        user_id: "550e8400-e29b-41d4-a716-446655440002",
        equipment_id: (await supabase.from("equipment").select("id").eq("serial_number", "LG-UW-004").single()).data
          ?.id,
        purpose: "Client presentation setup",
        start_date: "2024-01-15",
        end_date: "2024-01-16",
        status: "approved",
        admin_notes: "Approved for client meeting",
        notes: "Need ultrawide monitor for presentation demo",
      },
    ]

    const { error: requestsError } = await supabase.from("requests").upsert(requests)

    if (requestsError) {
      console.error("Error seeding requests:", requestsError)
    } else {
      console.log("✅ Requests seeded successfully")
    }

    // Seed activity logs
    const activityLogs = [
      {
        user_id: "550e8400-e29b-41d4-a716-446655440000",
        type: "equipment_added",
        message: 'New equipment added: MacBook Pro 16"',
        details: "Serial: MBP-001-2024, Category: laptop",
      },
      {
        user_id: "550e8400-e29b-41d4-a716-446655440001",
        type: "request_created",
        message: "New equipment request submitted",
        details: 'Requested MacBook Pro 16" for development work',
      },
      {
        user_id: "550e8400-e29b-41d4-a716-446655440000",
        type: "request_approved",
        message: "Equipment request approved",
        details: "Approved LG UltraWide Monitor request for Jane Doe",
      },
      {
        user_id: "550e8400-e29b-41d4-a716-446655440000",
        type: "user_created",
        message: "New user account created",
        details: "Created account for John Smith (Marketing)",
      },
    ]

    const { error: logsError } = await supabase.from("activity_logs").upsert(activityLogs)

    if (logsError) {
      console.error("Error seeding activity logs:", logsError)
    } else {
      console.log("✅ Activity logs seeded successfully")
    }

    console.log("🎉 Database seeding completed successfully!")
  } catch (error) {
    console.error("❌ Error during seeding:", error)
  }
}

// Run the seeding
seedData()
