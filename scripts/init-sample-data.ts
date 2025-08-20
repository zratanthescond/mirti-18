import { MongoClient } from "mongodb"

const client = new MongoClient(
  "mongodb://root:gI1LfzCG0X9Mb5K6aOgbrr3ORCjskW4VXIrIAS34vIQMuG4XAnYX4P5cDpt2cCXP@54.37.254.81:20199/?directConnection=true",
)

async function initSampleData() {
  try {
    await client.connect()
    const db = client.db("pizzeria_mirti")

    // Sample customers
    const sampleCustomers = [
      {
        name: "Maria Bianchi",
        email: "maria.bianchi@email.com",
        phone: "+39 333 123 4567",
        address: "Via Roma 45, 00100 Roma, Italy",
        joinDate: new Date("2023-01-15"),
        totalOrders: 12,
        totalSpent: 245.5,
        averageOrderValue: 20.46,
        lastOrderDate: new Date("2024-01-10"),
        status: "active",
        loyaltyPoints: 245,
        favoriteItems: ["Salmon & Zucchini Flatbread", "Classic Marinara Pizza"],
      },
      {
        name: "Giuseppe Verdi",
        email: "giuseppe.verdi@email.com",
        phone: "+39 333 987 6543",
        address: "Piazza Navona 12, 00100 Roma, Italy",
        joinDate: new Date("2023-03-20"),
        totalOrders: 8,
        totalSpent: 156.75,
        averageOrderValue: 19.59,
        lastOrderDate: new Date("2024-01-08"),
        status: "active",
        loyaltyPoints: 156,
        favoriteItems: ["Beef Carpaccio Platter", "Pear & Gorgonzola Flatbread"],
      },
      {
        name: "Anna Rossi",
        email: "anna.rossi@email.com",
        phone: "+39 333 456 7890",
        address: "Via del Corso 88, 00100 Roma, Italy",
        joinDate: new Date("2023-06-10"),
        totalOrders: 15,
        totalSpent: 312.25,
        averageOrderValue: 20.82,
        lastOrderDate: new Date("2024-01-12"),
        status: "active",
        loyaltyPoints: 312,
        favoriteItems: ["Artisan Sandwich Selection", "Turkey & Corn Flatbread"],
      },
    ]

    // Sample orders
    const sampleOrders = [
      {
        customer: {
          name: "Maria Bianchi",
          email: "maria.bianchi@email.com",
          phone: "+39 333 123 4567",
          address: "Via Roma 45, 00100 Roma, Italy",
        },
        items: [
          { id: "1", name: "Salmon & Zucchini Flatbread", quantity: 2, price: 17.5 },
          { id: "2", name: "Classic Marinara Pizza", quantity: 1, price: 9.5 },
        ],
        total: 44.5,
        status: "preparing",
        orderTime: new Date("2024-01-15T14:30:00Z"),
        estimatedTime: "25 minutes",
        notes: "Extra crispy please",
        paymentMethod: "Credit Card",
        deliveryFee: 0,
      },
      {
        customer: {
          name: "Giuseppe Verdi",
          email: "giuseppe.verdi@email.com",
          phone: "+39 333 987 6543",
          address: "Piazza Navona 12, 00100 Roma, Italy",
        },
        items: [
          { id: "3", name: "Beef Carpaccio Platter", quantity: 1, price: 18.5 },
          { id: "4", name: "Pear & Gorgonzola Flatbread", quantity: 1, price: 15.5 },
        ],
        total: 37.5,
        status: "ready",
        orderTime: new Date("2024-01-15T14:15:00Z"),
        estimatedTime: "Ready now",
        paymentMethod: "Cash",
        deliveryFee: 3.5,
      },
    ]

    // Sample products
    const sampleProducts = [
      {
        name: "Salmon & Zucchini Flatbread",
        description: "Fresh salmon with grilled zucchini, ricotta, and herbs on our signature flatbread",
        price: 17.5,
        category: "flatbreads",
        image: "/images/salmon-zucchini-flatbread.jpeg",
        available: true,
        ingredients: ["Fresh salmon", "Grilled zucchini", "Ricotta cheese", "Fresh herbs"],
        allergens: ["Fish", "Dairy", "Gluten"],
        popular: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Classic Marinara Pizza",
        description: "Traditional pizza with our homemade marinara sauce, mozzarella, and fresh basil",
        price: 9.5,
        category: "pizzas",
        image: "/images/classic-marinara.jpeg",
        available: true,
        ingredients: ["Marinara sauce", "Mozzarella", "Fresh basil", "Extra virgin olive oil"],
        allergens: ["Dairy", "Gluten"],
        popular: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Beef Carpaccio Platter",
        description: "Thinly sliced raw beef with arugula, parmesan shavings, and lemon dressing",
        price: 18.5,
        category: "appetizers",
        image: "/images/carpaccio-platter.jpeg",
        available: true,
        ingredients: ["Premium beef", "Fresh arugula", "Parmesan cheese", "Lemon dressing"],
        allergens: ["Dairy"],
        popular: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    // Sample specials
    const sampleSpecials = [
      {
        name: "Monday Morning Focaccia",
        description: "Start your week with our signature rosemary focaccia, topped with cherry tomatoes and sea salt",
        price: 8.5,
        image: "/images/caramelized-onion-flatbread.jpeg",
        type: "daily",
        day: "Monday",
        ingredients: ["Fresh rosemary", "Cherry tomatoes", "Sea salt", "Extra virgin olive oil"],
        available: true,
        popular: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Spring Asparagus Flatbread",
        description: "Fresh asparagus with lemon ricotta, mint, and prosciutto di Parma",
        price: 17.5,
        image: "/images/bresaola-arugula-flatbread.jpeg",
        type: "seasonal",
        season: "spring",
        ingredients: ["Fresh asparagus", "Lemon ricotta", "Fresh mint", "Prosciutto di Parma"],
        available: true,
        popular: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    // Insert sample data
    await db.collection("customers").deleteMany({})
    await db.collection("customers").insertMany(sampleCustomers)

    await db.collection("orders").deleteMany({})
    await db.collection("orders").insertMany(sampleOrders)

    await db.collection("products").deleteMany({})
    await db.collection("products").insertMany(sampleProducts)

    await db.collection("specials").deleteMany({})
    await db.collection("specials").insertMany(sampleSpecials)

    console.log("Sample data initialized successfully!")
  } catch (error) {
    console.error("Error initializing sample data:", error)
  } finally {
    await client.close()
  }
}

initSampleData()
