async function test() {
  try {
    const jwt = require("jsonwebtoken");
    const prisma = require("./src/utils/prisma").default;
    const user = await prisma.user.findFirst();
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || "123456",
      { expiresIn: "1d" }
    );
    
    console.log("Token:", token);
    
    const res = await fetch('http://localhost:5000/projects', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Projects response:", text);

    const res2 = await fetch('http://localhost:5000/projects/tasks', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Tasks response:", await res2.text());
    
  } catch (err: any) {
     console.error("API error:", err.message);
  }
}

test();
