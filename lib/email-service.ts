import { Resend } from 'resend';
import { getDestinationEmail, getEmailMessageForAAU, getEmailMessageForStandard } from './email-config';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailResult {
  success: boolean;
  error?: string;
  messageId?: string;
  confirmationSent?: boolean;
}

export async function sendDemandeNotification(demandeData: FormDemandeData): Promise<EmailResult> {
  try {
    // Obtenir la destination email selon la ville et le type de demande
    const destination = getDestinationEmail(demandeData.ville, demandeData.aau);
    
    if (!destination) {
      return {
        success: false,
        error: `Aucun destinataire configuré pour la ville ${demandeData.ville} (AAU: ${demandeData.aau})`
      };
    }

    // Générer le template HTML
    const htmlContent = generateEmailTemplate(demandeData, destination);
    
    // Préparer l'objet email
    const subject = demandeData.aau 
      ? `🚨 URGENT - Demande d'Aide Alimentaire d'Urgence - ${demandeData.prenom} ${demandeData.nom}`
      : `Nouvelle demande d'aide sociale - ${demandeData.prenom} ${demandeData.nom}`;

    // Envoyer l'email à l'organisme
    // Gérer le cas où destination.email peut être un string ou un array de strings
    const recipientEmails = Array.isArray(destination.email) 
      ? destination.email 
      : [destination.email];

    const { data, error } = await resend.emails.send({
      from: 'SAGGA <noreply@sagga.fr>',
      to: recipientEmails,
      subject,
      html: htmlContent,
      // Copie pour l'administration si c'est une demande AAU
      ...(demandeData.aau && {
        cc: ['contact@sagga.org', 'administratif@sagga.org']
      })
    });

    if (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de l\'envoi de l\'email à l\'organisme'
      };
    }

    // Envoyer également un email de confirmation au demandeur
    const confirmationResult = await sendConfirmationEmail(demandeData, destination);
    
    // On retourne le succès même si l'email de confirmation échoue
    // car l'email principal (vers l'organisme) a été envoyé
    if (!confirmationResult.success) {
      console.warn('Échec envoi email de confirmation:', confirmationResult.error);
    }

    return {
      success: true,
      messageId: data?.id,
      confirmationSent: confirmationResult.success
    };

  } catch (error) {
    console.error('Erreur envoi email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
}

// Nouvelle fonction pour envoyer l'email de confirmation au demandeur
export async function sendConfirmationEmail(demandeData: FormDemandeData, destination: any): Promise<EmailResult> {
  try {
    const htmlContent = generateConfirmationEmailTemplate(demandeData, destination);
    
    const subject = demandeData.aau 
      ? `✅ Confirmation - Votre demande d'aide alimentaire d'urgence a été transmise`
      : `✅ Confirmation - Votre demande d'aide sociale a été transmise`;

    const { data, error } = await resend.emails.send({
      from: 'SAGGA <noreply@sagga.fr>',
      to: [demandeData.email],
      subject,
      html: htmlContent,
      // Copie pour SAGGA pour traçabilité
      bcc: ['contact@sagga.org']
    });

    if (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de l\'envoi de l\'email de confirmation'
      };
    }

    return {
      success: true,
      messageId: data?.id
    };

  } catch (error) {
    console.error('Erreur envoi email de confirmation:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
}

// Interfaces adaptées au formulaire actuel
interface FormDemandeData {
  prenom: string;
  nom: string;
  dateNaissance: string;
  sexe?: string;
  situation?: string;
  telephone: string;
  email: string;
  adresse: string;
  ville: string;
  codePostal: string;
  aau: boolean;
  commentaires?: string;
  nombrePersonnesFoyer?: number; // Nouveau champ
  membres?: Array<{
    prenom: string;
    nom: string;
    dateNaissance: string;
    sexe?: string;
  }>;
  fichiers?: Array<{
    nom: string;
    url: string;
    taille: number;
    type: string;
    categorie: string;
  }>;
  fichierJustificatifs?: string;
  createdAt?: Date;
}

function generateEmailTemplate(demande: FormDemandeData, destination: any): string {
  const isAAU = demande.aau;
  const urgencyColor = isAAU ? '#dc2626' : '#059669';
  const urgencyBg = isAAU ? '#fef2f2' : '#f0fdf4';
  const urgencyBorder = isAAU ? '#fecaca' : '#bbf7d0';

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demande d'aide sociale - SAGGA</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #374151; margin: 0; padding: 20px; background-color: #f9fafb; }
        .container { max-width: 800px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #752D8B 0%, #5a2269 100%); color: white; padding: 24px; text-align: center; }
        .urgency-badge { display: inline-block; background: ${urgencyBg}; color: ${urgencyColor}; border: 2px solid ${urgencyBorder}; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 16px 0; }
        .content { padding: 24px; }
        .section { margin-bottom: 24px; padding: 20px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #752D8B; }
        .section h3 { margin-top: 0; color: #752D8B; font-size: 18px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; }
        .field { margin-bottom: 12px; }
        .field label { display: block; font-weight: 600; color: #374151; margin-bottom: 4px; }
        .field value { display: block; background: white; padding: 8px 12px; border-radius: 6px; border: 1px solid #d1d5db; }
        .membres-list { background: white; border-radius: 6px; overflow: hidden; }
        .membre-item { padding: 12px; border-bottom: 1px solid #e5e7eb; }
        .membre-item:last-child { border-bottom: none; }
        .footer { background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        .highlight { background: #fef3c7; padding: 2px 4px; border-radius: 4px; }
        .message-box { background: ${urgencyBg}; border: 1px solid ${urgencyBorder}; border-radius: 8px; padding: 16px; margin: 20px 0; color: ${urgencyColor}; }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>🍽️ SAGGA - Nouvelle Demande d'Aide Sociale</h1>
            <div class="urgency-badge">
                ${isAAU ? '🚨 AIDE ALIMENTAIRE D\'URGENCE' : '📋 DEMANDE STANDARD'}
            </div>
            <p>Destinataire: <strong>${destination.name}</strong></p>
        </div>

        <!-- Message personnalisé -->
        <div class="message-box">
            <strong>Message:</strong><br>
            ${isAAU ? getEmailMessageForAAU() : getEmailMessageForStandard()}
        </div>

        <div class="content">
            <!-- Informations personnelles -->
            <div class="section">
                <h3>👤 Informations personnelles</h3>
                <div class="grid">
                    <div class="field">
                        <label>Prénom</label>
                        <value>${demande.prenom}</value>
                    </div>
                    <div class="field">
                        <label>Nom</label>
                        <value>${demande.nom}</value>
                    </div>
                    <div class="field">
                        <label>Date de naissance</label>
                        <value>${new Date(demande.dateNaissance).toLocaleDateString('fr-FR')}</value>
                    </div>
                    ${demande.sexe ? `
                    <div class="field">
                        <label>Sexe</label>
                        <value>${demande.sexe}</value>
                    </div>
                    ` : ''}
                    ${demande.situation ? `
                    <div class="field">
                        <label>Situation familiale</label>
                        <value>${demande.situation}</value>
                    </div>
                    ` : ''}
                    <div class="field">
                        <label>Téléphone</label>
                        <value>${demande.telephone}</value>
                    </div>
                    <div class="field">
                        <label>Email</label>
                        <value>${demande.email}</value>
                    </div>
                </div>
            </div>

            <!-- Adresse -->
            <div class="section">
                <h3>📍 Adresse de résidence</h3>
                <div class="grid">
                    <div class="field">
                        <label>Adresse</label>
                        <value>${demande.adresse}</value>
                    </div>
                    <div class="field">
                        <label>Ville</label>
                        <value class="highlight">${demande.ville}</value>
                    </div>
                    <div class="field">
                        <label>Code postal</label>
                        <value>${demande.codePostal}</value>
                    </div>
                </div>
            </div>

            ${demande.aau ? `
            <!-- AAU -->
            <div class="section" style="border-left-color: #dc2626; background: #fef2f2;">
                <h3 style="color: #dc2626;">🚨 Aide Alimentaire d'Urgence (AAU)</h3>
                <div class="field">
                    <value style="background: #fee2e2; border-color: #fecaca; color: #991b1b; font-weight: bold;">
                        ⚠️ Cette personne a demandé une aide alimentaire d'urgence. 
                        Cette demande nécessite un traitement prioritaire.
                    </value>
                </div>
            </div>
            ` : ''}

            <!-- Membres du foyer -->
            ${demande.membres && demande.membres.length > 0 ? `
            <div class="section">
                <h3>👨‍👩‍👧‍👦 Composition du foyer (${demande.nombrePersonnesFoyer || (demande.membres.length + 1)} personne${(demande.nombrePersonnesFoyer || (demande.membres.length + 1)) > 1 ? 's' : ''})</h3>
                <div class="field">
                    <label>Demandeur principal</label>
                    <div class="membre-item">
                        <strong>${demande.prenom} ${demande.nom}</strong><br>
                        <small>Né(e) le: ${new Date(demande.dateNaissance).toLocaleDateString('fr-FR')} - Demandeur principal</small>
                    </div>
                </div>
                <div class="field">
                    <label>Autres membres du foyer</label>
                    <div class="membres-list">
                        ${demande.membres.map((membre, index) => `
                        <div class="membre-item">
                            <strong>${membre.prenom} ${membre.nom}</strong><br>
                            <small>Né(e) le: ${new Date(membre.dateNaissance).toLocaleDateString('fr-FR')} - ${membre.sexe || 'Non précisé'}</small>
                        </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            ` : `
            <div class="section">
                <h3>👨‍👩‍👧‍👦 Composition du foyer</h3>
                <div class="field">
                    <label>Nombre de personnes</label>
                    <value>1 personne (demandeur seul)</value>
                </div>
            </div>
            `}

            <!-- Commentaires -->
            ${demande.commentaires ? `
            <div class="section">
                <h3>📝 Commentaires et précisions</h3>
                <div class="field">
                    <label>Informations complémentaires</label>
                    <value>${demande.commentaires.replace(/\n/g, '<br>')}</value>
                </div>
            </div>
            ` : ''}

            <!-- Documents justificatifs -->
            ${demande.fichiers && demande.fichiers.length > 0 ? `
            <div class="section">
                <h3>📎 Documents justificatifs</h3>
                <p style="margin-bottom: 12px; color: #374151;">
                    <strong>${demande.fichiers.length}</strong> document(s) joint(s). Cliquez sur les liens ci-dessous pour télécharger :
                </p>
                
                <!-- Grouper par catégorie -->
                ${['IDENTITE', 'RESSOURCES', 'CHARGES'].map(categorie => {
                  const fichiers = demande.fichiers!.filter(f => f.categorie === categorie);
                  if (fichiers.length === 0) return '';
                  
                  const categorieLabel = {
                    'IDENTITE': '👤 Pièces d\'identité',
                    'RESSOURCES': '💰 Justificatifs de ressources',
                    'CHARGES': '🧾 Justificatifs de charges'
                  }[categorie];
                  
                  return `
                  <div class="field" style="margin-bottom: 16px;">
                    <label style="font-weight: 600; color: #111827; display: block; margin-bottom: 8px;">
                      ${categorieLabel}
                    </label>
                    <div style="background: #f9fafb; padding: 12px; border-radius: 6px; border: 1px solid #e5e7eb;">
                      ${fichiers.map((fichier, index) => `
                        <div style="margin-bottom: ${index < fichiers.length - 1 ? '8px' : '0'};">
                          <a href="${fichier.url}" 
                             target="_blank"
                             rel="noopener noreferrer"
                             style="color: #752D8B; text-decoration: none; font-weight: 500; display: inline-flex; align-items: center;">
                            📄 ${fichier.nom}
                          </a>
                          <span style="color: #6b7280; font-size: 12px; margin-left: 8px;">
                            (${(fichier.taille / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                  `;
                }).join('')}
                
                <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 12px; margin-top: 12px;">
                  <p style="margin: 0; font-size: 13px; color: #1e40af;">
                    💡 <strong>Astuce :</strong> Cliquez sur les liens pour ouvrir les documents dans votre navigateur. 
                    Vous pouvez également faire un clic droit → "Enregistrer sous" pour les télécharger.
                  </p>
                </div>
            </div>
            ` : demande.fichierJustificatifs ? `
            <div class="section">
                <h3>📎 Documents justificatifs</h3>
                <div class="field">
                    <label>Fichiers joints</label>
                    <value>✅ ${demande.fichierJustificatifs}</value>
                </div>
            </div>
            ` : ''}
        </div>

        <div class="footer">
            <p><strong>SAGGA</strong> - Demande reçue le ${demande.createdAt ? new Date(demande.createdAt).toLocaleDateString('fr-FR') + ' à ' + new Date(demande.createdAt).toLocaleTimeString('fr-FR') : new Date().toLocaleDateString('fr-FR') + ' à ' + new Date().toLocaleTimeString('fr-FR')}</p>
            <p>Cette demande ${isAAU ? 'urgente ' : ''}doit être traitée dans les plus brefs délais.</p>
            ${isAAU ? '<p><strong>⚠️ Cette demande nécessite une attention particulière en raison de son caractère urgent.</strong></p>' : ''}
            <p style="margin-top: 16px; font-size: 12px;">
                <strong>Contact SAGGA :</strong> contact@sagga.org | administratif@sagga.org
            </p>
        </div>
    </div>
</body>
</html>
  `;
}

function generateConfirmationEmailTemplate(demande: FormDemandeData, destination: any): string {
  const isAAU = demande.aau;
  const urgencyColor = isAAU ? '#dc2626' : '#059669';
  const urgencyBg = isAAU ? '#fef2f2' : '#f0fdf4';
  const urgencyBorder = isAAU ? '#fecaca' : '#bbf7d0';
  const nombrePersonnes = demande.membres ? demande.membres.length + 1 : 1;
  const personnesText = nombrePersonnes > 1 ? 'personnes' : 'personne';

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmation de votre demande - SAGGA</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #374151; margin: 0; padding: 20px; background-color: #f9fafb; }
        .container { max-width: 700px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #752D8B 0%, #5a2269 100%); color: white; padding: 24px; text-align: center; }
        .success-badge { display: inline-block; background: #f0fdf4; color: #059669; border: 2px solid #bbf7d0; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 16px 0; }
        .urgency-badge { display: inline-block; background: ${urgencyBg}; color: ${urgencyColor}; border: 2px solid ${urgencyBorder}; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 8px 0; }
        .content { padding: 24px; }
        .section { margin-bottom: 24px; padding: 20px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #752D8B; }
        .section h3 { margin-top: 0; color: #752D8B; font-size: 18px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
        .field { margin-bottom: 12px; }
        .field label { display: block; font-weight: 600; color: #374151; margin-bottom: 4px; }
        .field value { display: block; background: white; padding: 8px 12px; border-radius: 6px; border: 1px solid #d1d5db; }
        .footer { background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        .highlight { background: #fef3c7; padding: 2px 4px; border-radius: 4px; }
        .info-box { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin: 20px 0; color: #1e40af; }
        .important-box { background: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 16px; margin: 20px 0; color: #92400e; }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>✅ Confirmation de réception</h1>
            <div class="success-badge">
                DEMANDE BIEN REÇUE
            </div>
            <p>Bonjour <strong>${demande.prenom} ${demande.nom}</strong>,</p>
            <p>Votre demande d'aide sociale a été transmise avec succès.</p>
        </div>

        <div class="content">
            <!-- Message principal -->
            <div class="info-box">
                <strong>📧 Votre demande a été transmise à :</strong><br>
                <strong>${destination.name}</strong><br>
                ${isAAU ? '🚨 Votre demande d\'aide alimentaire d\'urgence sera traitée en priorité.' : '📋 Votre demande sera examinée dans les plus brefs délais.'}
            </div>

            ${isAAU ? `
            <div class="urgency-badge">
                🚨 AIDE ALIMENTAIRE D'URGENCE
            </div>
            ` : ''}

            <!-- Résumé de la demande -->
            <div class="section">
                <h3>📋 Résumé de votre demande</h3>
                <div class="grid">
                    <div class="field">
                        <label>Nom complet</label>
                        <value>${demande.prenom} ${demande.nom}</value>
                    </div>
                    <div class="field">
                        <label>Date de naissance</label>
                        <value>${new Date(demande.dateNaissance).toLocaleDateString('fr-FR')}</value>
                    </div>
                    <div class="field">
                        <label>Email de contact</label>
                        <value>${demande.email}</value>
                    </div>
                    <div class="field">
                        <label>Téléphone</label>
                        <value>${demande.telephone}</value>
                    </div>
                    <div class="field">
                        <label>Commune</label>
                        <value class="highlight">${demande.ville}</value>
                    </div>
                    <div class="field">
                        <label>Composition du foyer</label>
                        <value>${nombrePersonnes} ${personnesText}</value>
                    </div>
                </div>
            </div>

            <!-- Prochaines étapes -->
            <div class="section">
                <h3>⏭️ Prochaines étapes</h3>
                <div class="field">
                    <ul style="margin: 0; padding-left: 20px;">
                        <li><strong>Examen de votre dossier</strong> : ${destination.name} va examiner votre demande</li>
                        ${isAAU ? '<li><strong>Traitement prioritaire</strong> : Votre demande sera traitée en urgence</li>' : ''}
                        <li><strong>Contact direct</strong> : L'organisme vous contactera directement pour la suite</li>
                        <li><strong>Notification SAGGA</strong> : Nous serons informés de l'avancement de votre dossier</li>
                    </ul>
                </div>
            </div>

            <!-- Informations importantes -->
            <div class="important-box">
                <h4 style="margin-top: 0; color: #92400e;">⚠️ Informations importantes</h4>
                <ul style="margin: 0; padding-left: 20px;">
                    <li>Conservez cet email comme preuve de votre demande</li>
                    <li>Vous serez contacté(e) directement par ${destination.name}</li>
                    ${isAAU ? '<li><strong>AAU</strong> : Votre demande urgente est prioritaire</li>' : ''}
                    <li>En cas de question, contactez SAGGA aux coordonnées ci-dessous</li>
                </ul>
            </div>

            <!-- Contact -->
            <div class="section">
                <h3>📞 Nous contacter</h3>
                <div class="grid">
                    <div class="field">
                        <label>Email principal</label>
                        <value>contact@sagga.org</value>
                    </div>
                    <div class="field">
                        <label>Email administratif</label>
                        <value>administratif@sagga.org</value>
                    </div>
                </div>
            </div>
        </div>

        <div class="footer">
            <p><strong>SAGGA</strong> - Demande reçue le ${demande.createdAt ? new Date(demande.createdAt).toLocaleDateString('fr-FR') + ' à ' + new Date(demande.createdAt).toLocaleTimeString('fr-FR') : new Date().toLocaleDateString('fr-FR') + ' à ' + new Date().toLocaleTimeString('fr-FR')}</p>
            <p>Merci de votre confiance. Nous restons à votre disposition pour toute question.</p>
            <p style="margin-top: 16px; font-size: 12px;">
                <strong>SAGGA</strong> - Service d'Aide et de Gestion Guyane Alimentaire
            </p>
        </div>
    </div>
</body>
</html>
  `;
}
