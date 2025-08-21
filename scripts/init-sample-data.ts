import { getDatabase } from "../lib/mongodb"

async function initSampleData() {
  try {
    const db = await getDatabase()

    // Clear existing data
    await Promise.all([
      db.collection("menu_items").deleteMany({}),
      db.collection("orders").deleteMany({}),
      db.collection("customers").deleteMany({}),
      db.collection("restaurant_settings").deleteMany({}),
    ])

    console.log("Cleared existing data")

    // Sample menu items
    const menuItems = [
      {
        name: "Bresaola & Arugula",
        description: "Bresaola, fresh arugula, Parmigiano-Reggiano, lemon zest on our signature flatbread",
        price: 18.0,
        category: "flatbreads",
        image: "/images/bresaola-arugula-flatbread.jpeg",
        available: true,
        popular: true,
        ingredients: ["bresaola", "arugula", "parmigiano-reggiano", "lemon zest", "flatbread"],
        allergens: ["gluten", "dairy"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Pear & Gorgonzola",
        description: "Sweet pears, creamy gorgonzola, walnuts, honey drizzle",
        price: 17.0,
        category: "flatbreads",
        image: "/images/pear-gorgonzola-flatbread.jpeg",
        available: true,
        popular: true,
        ingredients: ["pears", "gorgonzola", "walnuts", "honey", "flatbread"],
        allergens: ["gluten", "dairy", "nuts"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Ham & Pesto",
        description: "Prosciutto di Parma, basil pesto, cherry tomatoes, mozzarella",
        price: 16.5,
        category: "flatbreads",
        image: "/images/ham-pesto-flatbread.jpeg",
        available: true,
        popular: false,
        ingredients: ["prosciutto", "basil pesto", "cherry tomatoes", "mozzarella", "flatbread"],
        allergens: ["gluten", "dairy"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Margherita Classica",
        description: "San Marzano tomatoes, fresh mozzarella di bufala, basil, extra virgin olive oil",
        price: 14.5,
        category: "pizzas",
        image: "/images/classic-marinara.jpeg",
        available: true,
        popular: true,
        ingredients: ["san marzano tomatoes", "mozzarella di bufala", "basil", "olive oil"],
        allergens: ["gluten", "dairy"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Diavola",
        description: "Spicy salami, mozzarella, tomato sauce, chili flakes",
        price: 16.0,
        category: "pizzas",
        image: "/images/pepper-pizza.jpeg",
        available: true,
        popular: false,
        ingredients: ["spicy salami", "mozzarella", "tomato sauce", "chili flakes"],
        allergens: ["gluten", "dairy"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Carpaccio di Manzo",
        description: "Thinly sliced raw beef, arugula, capers, Parmigiano shavings, lemon",
        price: 22.0,
        category: "antipasti",
        image: "/images/carpaccio-platter.jpeg",
        available: true,
        popular: true,
        ingredients: ["beef carpaccio", "arugula", "capers", "parmigiano", "lemon"],
        allergens: ["dairy"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Caprese Sandwich",
        description: "Fresh mozzarella, tomatoes, basil, balsamic glaze on ciabatta",
        price: 12.5,
        category: "sandwiches",
        image: "/images/artisan-sandwiches.jpeg",
        available: true,
        popular: false,
        ingredients: ["mozzarella", "tomatoes", "basil", "balsamic", "ciabatta"],
        allergens: ["gluten", "dairy"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Calzone Classico",
        description: "Ricotta, mozzarella, prosciutto, mushrooms, folded pizza dough",
        price: 16.5,
        category: "calzones",
        image: "/images/stuffed-calzones.jpeg",
        available: true,
        popular: false,
        ingredients: ["ricotta", "mozzarella", "prosciutto", "mushrooms", "pizza dough"],
        allergens: ["gluten", "dairy"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    const menuResult = await db.collection("menu_items").insertMany(menuItems)
    console.log(`Inserted ${menuResult.insertedCount} menu items`)

    // Sample customers
    const customers = [
      {
        name: "Marco Rossi",
        email: "marco.rossi@email.com",
        phone: "+39 123 456 7890",
        addresses: [
          {
            id: "addr1",
            label: "Home",
            street: "Via Roma 123",
            city: "Milano",
            postalCode: "20121",
            isDefault: true,
          },
        ],
        preferences: {
          favoriteItems: [],
          dietaryRestrictions: [],
          allergies: [],
        },
        orderHistory: [],
        totalOrders: 0,
        totalSpent: 0,
        loyaltyPoints: 0,
        createdAt: new Date(),
      },
      {
        name: "Sofia Bianchi",
        email: "sofia.bianchi@email.com",
        phone: "+39 987 654 3210",
        addresses: [
          {
            id: "addr2",
            label: "Home",
            street: "Corso Buenos Aires 45",
            city: "Milano",
            postalCode: "20124",
            isDefault: true,
          },
        ],
        preferences: {
          favoriteItems: [],
          dietaryRestrictions: ["vegetarian"],
          allergies: ["nuts"],
        },
        orderHistory: [],
        totalOrders: 0,
        totalSpent: 0,
        loyaltyPoints: 0,
        createdAt: new Date(),
      },
      {
        name: "Giuseppe Verde",
        email: "giuseppe.verde@email.com",
        phone: "+39 555 123 4567",
        addresses: [
          {
            id: "addr3",
            label: "Home",
            street: "Piazza Duomo 1",
            city: "Milano",
            postalCode: "20122",
            isDefault: true,
          },
        ],
        preferences: {
          favoriteItems: [],
          dietaryRestrictions: [],
          allergies: ["dairy"],
        },
        orderHistory: [],
        totalOrders: 0,
        totalSpent: 0,
        loyaltyPoints: 0,
        createdAt: new Date(),
      },
    ]

    const customerResult = await db.collection("customers").insertMany(customers)
    console.log(`Inserted ${customerResult.insertedCount} customers`)

    // Sample orders
    const customerIds = Object.values(customerResult.insertedIds)
    const menuItemIds = Object.values(menuResult.insertedIds)

    const orders = [
      {
        orderNumber: "ORD-000001",
        customerId: customerIds[0],
        customerInfo: {
          name: "Marco Rossi",
          email: "marco.rossi@email.com",
          phone: "+39 123 456 7890",
        },
        items: [
          {
            menuItemId: menuItemIds[3], // Margherita
            name: "Margherita Classica",
            price: 14.5,
            quantity: 1,
          },
          {
            menuItemId: menuItemIds[0], // Bresaola
            name: "Bresaola & Arugula",
            price: 18.0,
            quantity: 1,
          },
        ],
        subtotal: 32.5,
        tax: 7.15,
        deliveryFee: 3.5,
        total: 43.15,
        status: "preparing",
        orderType: "delivery",
        deliveryAddress: {
          street: "Via Roma 123",
          city: "Milano",
          postalCode: "20121",
          instructions: "Ring the bell twice",
        },
        paymentStatus: "paid",
        paymentMethod: "card",
        notes: "Extra basil please",
        estimatedReadyTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderNumber: "ORD-000002",
        customerId: customerIds[1],
        customerInfo: {
          name: "Sofia Bianchi",
          email: "sofia.bianchi@email.com",
          phone: "+39 987 654 3210",
        },
        items: [
          {
            menuItemId: menuItemIds[5], // Carpaccio
            name: "Carpaccio di Manzo",
            price: 22.0,
            quantity: 1,
          },
          {
            menuItemId: menuItemIds[1], // Pear & Gorgonzola
            name: "Pear & Gorgonzola",
            price: 17.0,
            quantity: 1,
          },
        ],
        subtotal: 39.0,
        tax: 8.58,
        deliveryFee: 3.5,
        total: 51.08,
        status: "pending",
        orderType: "delivery",
        deliveryAddress: {
          street: "Corso Buenos Aires 45",
          city: "Milano",
          postalCode: "20124",
        },
        paymentStatus: "paid",
        paymentMethod: "online",
        createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        updatedAt: new Date(Date.now() - 5 * 60 * 1000),
      },
      {
        orderNumber: "ORD-000003",
        customerId: customerIds[2],
        customerInfo: {
          name: "Giuseppe Verde",
          email: "giuseppe.verde@email.com",
          phone: "+39 555 123 4567",
        },
        items: [
          {
            menuItemId: menuItemIds[7], // Calzone
            name: "Calzone Classico",
            price: 16.5,
            quantity: 1,
          },
          {
            menuItemId: menuItemIds[6], // Caprese Sandwich
            name: "Caprese Sandwich",
            price: 12.5,
            quantity: 1,
          },
        ],
        subtotal: 29.0,
        tax: 6.38,
        deliveryFee: 0, // pickup
        total: 35.38,
        status: "ready",
        orderType: "pickup",
        paymentStatus: "paid",
        paymentMethod: "cash",
        actualReadyTime: new Date(),
        createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        updatedAt: new Date(),
      },
    ]

    const orderResult = await db.collection("orders").insertMany(orders)
    console.log(`Inserted ${orderResult.insertedCount} orders`)

    // Update customer stats
    for (let i = 0; i < customerIds.length; i++) {
      const customerId = customerIds[i]
      const customerOrders = orders.filter((order) => order.customerId.equals(customerId))

      await db.collection("customers").updateOne(
        { _id: customerId },
        {
          $set: {
            totalOrders: customerOrders.length,
            totalSpent: customerOrders.reduce((sum, order) => sum + order.total, 0),
            lastOrderAt:
              customerOrders.length > 0 ? Math.max(...customerOrders.map((o) => o.createdAt.getTime())) : undefined,
            orderHistory: customerOrders.map((order) => order._id),
          },
        },
      )
    }

    // Default restaurant settings
    const settings = {
      restaurant: {
        name: "Pizzeria Mirti",
        description: "Authentic Italian cuisine with fresh ingredients and traditional recipes",
        address: {
          street: "Via Roma 123",
          city: "Milano",
          postalCode: "20121",
          country: "Italy",
        },
        contact: {
          phone: "+39 02 1234 5678",
          email: "info@pizzeriamirti.com",
          website: "https://pizzeriamirti.com",
        },
        hours: {
          monday: { open: "11:00", close: "23:00", closed: false },
          tuesday: { open: "11:00", close: "23:00", closed: false },
          wednesday: { open: "11:00", close: "23:00", closed: false },
          thursday: { open: "11:00", close: "23:00", closed: false },
          friday: { open: "11:00", close: "24:00", closed: false },
          saturday: { open: "11:00", close: "24:00", closed: false },
          sunday: { open: "12:00", close: "22:00", closed: false },
        },
      },
      delivery: {
        enabled: true,
        radius: 10,
        minimumOrder: 15,
        fee: 3.5,
        freeDeliveryThreshold: 30,
      },
      payment: {
        acceptCash: true,
        acceptCard: true,
        acceptOnline: true,
        taxRate: 0.22,
      },
      notifications: {
        emailOrders: true,
        smsOrders: false,
        emailMarketing: true,
      },
      updatedAt: new Date(),
    }

    await db.collection("restaurant_settings").insertOne(settings)
    console.log("Inserted restaurant settings")

    console.log("Sample data initialization completed successfully!")
  } catch (error) {
    console.error("Error initializing sample data:", error)
    process.exit(1)
  }
}

// Run the initialization
initSampleData()
