import "dotenv/config";
import prisma from "./src/db/prisma";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data
  await prisma.vote.deleteMany({});
  await prisma.candidate.deleteMany({});
  await prisma.electionParticipant.deleteMany({});
  await prisma.election.deleteMany({});
  await prisma.departmentMember.deleteMany({});
  await prisma.department.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("✓ Cleared existing data");

  // Create users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: "alice@example.com",
        password: await bcrypt.hash("password123", SALT_ROUNDS),
        name: "Alice Johnson",
      },
    }),
    prisma.user.create({
      data: {
        email: "bob@example.com",
        password: await bcrypt.hash("password123", SALT_ROUNDS),
        name: "Bob Smith",
      },
    }),
    prisma.user.create({
      data: {
        email: "carol@example.com",
        password: await bcrypt.hash("password123", SALT_ROUNDS),
        name: "Carol Davis",
      },
    }),
    prisma.user.create({
      data: {
        email: "david@example.com",
        password: await bcrypt.hash("password123", SALT_ROUNDS),
        name: "David Wilson",
      },
    }),
    prisma.user.create({
      data: {
        email: "eve@example.com",
        password: await bcrypt.hash("password123", SALT_ROUNDS),
        name: "Eve Taylor",
      },
    }),
    prisma.user.create({
      data: {
        email: "frank@example.com",
        password: await bcrypt.hash("password123", SALT_ROUNDS),
        name: "Frank Brown",
      },
    }),
    prisma.user.create({
      data: {
        email: "grace@example.com",
        password: await bcrypt.hash("password123", SALT_ROUNDS),
        name: "Grace Lee",
      },
    }),
    prisma.user.create({
      data: {
        email: "henry@example.com",
        password: await bcrypt.hash("password123", SALT_ROUNDS),
        name: "Henry Martinez",
      },
    }),
  ]);

  console.log(`✓ Created ${users.length} users`);

  // Create departments
  const department = await prisma.department.create({
    data: {
      name: "Students",
    },
  });

  console.log("✓ Created department");

  // Create elections
  const election1 = await prisma.election.create({
    data: {
      title: "Student Council President 2024",
      description: "Annual election for student council president position",
      startDate: new Date("2025-12-15"),
      endDate: new Date("2025-12-20"),
      status: "ACTIVE",
      creatorId: users[0].id, // Alice is creator
      departmentId: department.id,
      candidates: {
        create: [
          { name: "John Candidate", description: "Focus on student activities" },
          { name: "Sarah Candidate", description: "Improve facilities" },
          { name: "Mike Candidate", description: "Better communication" },
        ],
      },
      participants: {
        create: [
          { userId: users[0].id },
          { userId: users[1].id },
          { userId: users[2].id },
          { userId: users[3].id },
          { userId: users[4].id },
        ],
      },
    },
    include: { candidates: true, participants: true },
  });

  console.log("✓ Created election 1 with candidates and participants");

  // Create votes for election 1
  const election1Votes = await prisma.vote.createMany({
    data: [
      { electionId: election1.id, userId: users[0].id, candidateId: election1.candidates[0].id },
      { electionId: election1.id, userId: users[1].id, candidateId: election1.candidates[0].id },
      { electionId: election1.id, userId: users[2].id, candidateId: election1.candidates[1].id },
      { electionId: election1.id, userId: users[3].id, candidateId: election1.candidates[1].id },
      { electionId: election1.id, userId: users[4].id, candidateId: election1.candidates[2].id },
    ],
  });

  console.log(`✓ Created ${election1Votes.count} votes for election 1`);

  // Create election 2
  const election2 = await prisma.election.create({
    data: {
      title: "Class Representative 2024",
      description: "Election for class representative",
      startDate: new Date("2025-12-16"),
      endDate: new Date("2025-12-22"),
      status: "ACTIVE",
      creatorId: users[1].id, // Bob is creator
      candidates: {
        create: [
          { name: "Lisa Representative", description: "Support class events" },
          { name: "Tom Representative", description: "Promote inclusivity" },
        ],
      },
      participants: {
        create: [
          { userId: users[1].id },
          { userId: users[2].id },
          { userId: users[3].id },
          { userId: users[4].id },
          { userId: users[5].id },
          { userId: users[6].id },
        ],
      },
    },
    include: { candidates: true, participants: true },
  });

  console.log("✓ Created election 2 with candidates and participants");

  // Create votes for election 2
  const election2Votes = await prisma.vote.createMany({
    data: [
      { electionId: election2.id, userId: users[1].id, candidateId: election2.candidates[0].id },
      { electionId: election2.id, userId: users[2].id, candidateId: election2.candidates[0].id },
      { electionId: election2.id, userId: users[3].id, candidateId: election2.candidates[0].id },
      { electionId: election2.id, userId: users[4].id, candidateId: election2.candidates[1].id },
      { electionId: election2.id, userId: users[5].id, candidateId: election2.candidates[1].id },
      { electionId: election2.id, userId: users[6].id, candidateId: election2.candidates[1].id },
    ],
  });

  console.log(`✓ Created ${election2Votes.count} votes for election 2`);

  // Create election 3 (upcoming)
  const election3 = await prisma.election.create({
    data: {
      title: "Sports Committee Head 2024",
      description: "Election for head of the sports committee",
      startDate: new Date("2025-12-25"),
      endDate: new Date("2026-01-05"),
      status: "UPCOMING",
      creatorId: users[2].id, // Carol is creator
      candidates: {
        create: [
          { name: "James Sports", description: "Focus on athletic events" },
          { name: "Sophie Sports", description: "Improve sports facilities" },
          { name: "Chris Sports", description: "Expand sports programs" },
        ],
      },
      participants: {
        create: [
          { userId: users[2].id },
          { userId: users[3].id },
          { userId: users[5].id },
          { userId: users[6].id },
          { userId: users[7].id },
        ],
      },
    },
    include: { candidates: true },
  });

  console.log("✓ Created election 3 (upcoming, no votes yet)");

  // Create election 4 (completed)
  const election4 = await prisma.election.create({
    data: {
      title: "Cultural Secretary 2024",
      description: "Election for cultural secretary position",
      startDate: new Date("2025-12-01"),
      endDate: new Date("2025-12-10"),
      status: "ENDED",
      creatorId: users[3].id, // David is creator
      candidates: {
        create: [
          { name: "Nina Culture", description: "Focus on cultural events" },
          { name: "Oscar Culture", description: "Promote diversity" },
        ],
      },
      participants: {
        create: [
          { userId: users[3].id },
          { userId: users[4].id },
          { userId: users[5].id },
          { userId: users[6].id },
          { userId: users[7].id },
        ],
      },
    },
    include: { candidates: true, participants: true },
  });

  console.log("✓ Created election 4 (ended/completed)");

  // Create votes for election 4
  const election4Votes = await prisma.vote.createMany({
    data: [
      { electionId: election4.id, userId: users[3].id, candidateId: election4.candidates[0].id },
      { electionId: election4.id, userId: users[4].id, candidateId: election4.candidates[0].id },
      { electionId: election4.id, userId: users[5].id, candidateId: election4.candidates[0].id },
      { electionId: election4.id, userId: users[6].id, candidateId: election4.candidates[1].id },
      { electionId: election4.id, userId: users[7].id, candidateId: election4.candidates[1].id },
    ],
  });

  console.log(`✓ Created ${election4Votes.count} votes for election 4`);

  console.log("\n✅ Database seeding complete!");
  console.log(`   - Users: ${users.length}`);
  console.log(`   - Elections: 4`);
  console.log(`   - Total votes: ${election1Votes.count + election2Votes.count + election4Votes.count}`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
