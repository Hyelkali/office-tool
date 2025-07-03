import { supabase } from "../src/lib/supabase.js"

async function seedMaintenanceData() {
  try {
    console.log("🌱 Starting maintenance data seeding...")

    // Get existing equipment and users
    const { data: equipment } = await supabase.from("equipment").select("id, name")
    const { data: users } = await supabase.from("users").select("id, name, role")

    if (!equipment?.length || !users?.length) {
      console.log("❌ No equipment or users found. Please seed basic data first.")
      return
    }

    const technicians = users.filter((user) => user.role === "technician" || user.role === "admin")
    const admins = users.filter((user) => user.role === "admin")

    // Sample maintenance records
    const maintenanceRecords = [
      {
        equipment_id: equipment[0]?.id,
        technician_id: technicians[0]?.id,
        type: "preventive",
        description: "Regular maintenance check and cleaning",
        scheduled_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
        estimated_duration: 2.0,
        status: "scheduled",
        priority: "medium",
        created_by: admins[0]?.id,
      },
      {
        equipment_id: equipment[1]?.id,
        technician_id: technicians[0]?.id,
        type: "corrective",
        description: "Fix printer paper jam issue",
        scheduled_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
        estimated_duration: 1.5,
        status: "scheduled",
        priority: "high",
        created_by: admins[0]?.id,
      },
      {
        equipment_id: equipment[2]?.id,
        technician_id: technicians[0]?.id,
        type: "inspection",
        description: "Safety inspection and compliance check",
        scheduled_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        completed_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        estimated_duration: 1.0,
        actual_duration: 1.2,
        status: "completed",
        priority: "medium",
        cost: 150.0,
        notes: "All safety checks passed. Minor adjustments made.",
        created_by: admins[0]?.id,
      },
      {
        equipment_id: equipment[3]?.id,
        technician_id: technicians[0]?.id,
        type: "emergency",
        description: "Critical system failure - immediate attention required",
        scheduled_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        estimated_duration: 4.0,
        status: "in-progress",
        priority: "critical",
        created_by: admins[0]?.id,
      },
      {
        equipment_id: equipment[4]?.id,
        technician_id: technicians[0]?.id,
        type: "preventive",
        description: "Quarterly maintenance and software updates",
        scheduled_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks from now
        estimated_duration: 3.0,
        status: "scheduled",
        priority: "low",
        created_by: admins[0]?.id,
      },
    ]

    // Insert maintenance records
    const { data: insertedRecords, error: maintenanceError } = await supabase
      .from("maintenance_records")
      .insert(maintenanceRecords)
      .select()

    if (maintenanceError) {
      console.error("❌ Error inserting maintenance records:", maintenanceError)
      return
    }

    console.log(`✅ Inserted ${insertedRecords.length} maintenance records`)

    // Sample notifications
    const notifications = [
      {
        user_id: technicians[0]?.id,
        type: "maintenance_scheduled",
        title: "New Maintenance Scheduled",
        message: `Maintenance has been scheduled for ${equipment[0]?.name}`,
        data: { maintenance_id: insertedRecords[0]?.id },
      },
      {
        user_id: technicians[0]?.id,
        type: "maintenance_due",
        title: "Maintenance Due Soon",
        message: `Maintenance for ${equipment[1]?.name} is due in 2 days`,
        data: { maintenance_id: insertedRecords[1]?.id },
      },
      {
        user_id: admins[0]?.id,
        type: "maintenance_completed",
        title: "Maintenance Completed",
        message: `Maintenance for ${equipment[2]?.name} has been completed`,
        data: { maintenance_id: insertedRecords[2]?.id },
      },
      {
        user_id: admins[0]?.id,
        type: "maintenance_overdue",
        title: "Critical Maintenance Required",
        message: `Emergency maintenance for ${equipment[3]?.name} is in progress`,
        data: { maintenance_id: insertedRecords[3]?.id },
      },
    ]

    // Insert notifications
    const { data: insertedNotifications, error: notificationError } = await supabase
      .from("notifications")
      .insert(notifications)
      .select()

    if (notificationError) {
      console.error("❌ Error inserting notifications:", notificationError)
      return
    }

    console.log(`✅ Inserted ${insertedNotifications.length} notifications`)

    // Update user roles if needed
    const roleUpdates = [
      { id: users[0]?.id, role: "admin", is_default_admin: true },
      { id: users[1]?.id, role: "technician" },
      { id: users[2]?.id, role: "staff" },
    ]

    for (const update of roleUpdates) {
      if (update.id) {
        await supabase
          .from("users")
          .update({
            role: update.role,
            is_default_admin: update.is_default_admin || false,
            is_active: true,
          })
          .eq("id", update.id)
      }
    }

    console.log("✅ Updated user roles")
    console.log("🎉 Maintenance data seeding completed successfully!")
  } catch (error) {
    console.error("❌ Error seeding maintenance data:", error)
  }
}

// Run the seeding function
seedMaintenanceData()
