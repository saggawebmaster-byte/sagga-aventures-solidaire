import { PrismaClient } from '@prisma/client'
import { hashPassword } from 'better-auth/crypto'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Début du seed de la base de données...')

  // Vérifier si un admin existe déjà
  const existingAdmin = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  })

  if (existingAdmin) {
    console.log('✅ Un administrateur existe déjà:', existingAdmin.email)
    return
  }

  // Créer un utilisateur administrateur
  const adminEmail = 'admin@sagga.fr'
  const adminPassword = 'Admin@SAGGA2024!' // Changez ce mot de passe !
  
  // Hacher le mot de passe au format Better Auth
  const hashedPassword = await hashPassword(adminPassword)

  // Créer l'utilisateur admin
  const admin = await prisma.user.create({
    data: {
      name: 'Administrateur SAGGA',
      email: adminEmail,
      emailVerified: true,
      role: 'ADMIN',
    },
  })

  console.log('✅ Utilisateur administrateur créé:', admin.email)

  // Créer le compte associé avec le mot de passe
  await prisma.account.create({
    data: {
      accountId: `credential:${admin.id}`,
      userId: admin.id,
      providerId: 'credential',
      type: 'credential',
      password: hashedPassword,
    },
  })

  console.log('✅ Compte credential créé pour l\'administrateur')
  console.log('\n📧 Email:', adminEmail)
  console.log('🔑 Mot de passe:', adminPassword)
  console.log('\n⚠️  IMPORTANT: Changez ce mot de passe après la première connexion!')
  
  // Optionnel : Créer quelques demandes de test
  console.log('\n🌱 Création de demandes de test...')
  
  const demande1 = await prisma.demande.create({
    data: {
      prenom: 'Jean',
      nom: 'Dupont',
      dateNaissance: '1980-05-15',
      sexe: 'HOMME',
      situation: 'MARIE',
      email: 'jean.dupont@example.com',
      telephonePortable: '0694123456',
      adresse: '123 Rue de la République',
      codePostal: '97300',
      ville: 'Cayenne',
      aau: false,
      status: 'ENVOYE',
      membresfoyer: {
        create: [
          {
            nom: 'Dupont',
            prenom: 'Marie',
            sexe: 'FEMME',
            dateNaissance: '1982-03-20',
          },
          {
            nom: 'Dupont',
            prenom: 'Lucas',
            sexe: 'HOMME',
            dateNaissance: '2010-07-10',
          },
        ],
      },
    },
  })

  const demande2 = await prisma.demande.create({
    data: {
      prenom: 'Sophie',
      nom: 'Martin',
      dateNaissance: '1975-11-28',
      sexe: 'FEMME',
      situation: 'CELIBATAIRE',
      email: 'sophie.martin@example.com',
      telephonePortable: '0694987654',
      adresse: '45 Avenue Voltaire',
      codePostal: '97300',
      ville: 'Cayenne',
      aau: true,
      status: 'TRAITE',
      commentaires: 'Demande urgente - famille en difficulté',
      membresfoyer: {
        create: [
          {
            nom: 'Martin',
            prenom: 'Emma',
            sexe: 'FEMME',
            dateNaissance: '2012-09-15',
          },
        ],
      },
    },
  })

  console.log('✅ Demandes de test créées:', demande1.id, demande2.id)
  console.log('\n✨ Seed terminé avec succès!')
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
