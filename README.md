nextjs-saga-webapp


```sh
# 1. Générer le client Prisma (synchronise le schéma avec votre code)
npx prisma generate


# 2. Pousser le schéma vers la nouvelle base de données
npx prisma db push


# ou si vous utilisez des migrations :
npx prisma migrate deploy


# 3. Optionnel : Voir vos données avec Prisma Studio
npx prisma migrate deploy


# Si vous avez besoin de données de test
# Si vous aviez des données dans votre ancienne base Neon et souhaitez les migrer, vous pouvez :
npx prisma db seed

# Ou réinitialiser complètement (⚠️ supprime toutes les données)
npx prisma migrate reset


# Vérification
# Pour vérifier que la connexion fonctionne :
npx prisma db pull