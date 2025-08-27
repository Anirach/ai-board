import prisma from './config/database.js';

const setUserAsAdmin = async (email) => {
  try {
    console.log(`🔧 Setting user ${email} as admin...`);

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.log(`❌ User with email ${email} not found. They need to register first.`);
      return;
    }

    await prisma.user.update({
      where: { email },
      data: { isAdmin: true }
    });

    console.log(`✅ User ${email} is now an admin!`);
    console.log(`📋 User details:`);
    console.log(`   - ID: ${user.id}`);
    console.log(`   - Username: ${user.username}`);
    console.log(`   - Name: ${user.firstName || 'N/A'} ${user.lastName || ''}`);

  } catch (error) {
    console.error('❌ Error setting admin status:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

// Set the specified email as admin
const adminEmail = 'anirach.m@fitm.kmutnb.ac.th';
setUserAsAdmin(adminEmail)
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
