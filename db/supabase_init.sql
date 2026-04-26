-- ============================================================
-- IDOC - Portail DRH Ministère des Sports - Côte d'Ivoire
-- Script d'initialisation Supabase (PostgreSQL)
-- Exécuter dans : Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ── 1. ENUMS ──────────────────────────────────────────────

CREATE TYPE "UserRole" AS ENUM (
  'AGENT',
  'SERVICE_COURRIER',
  'SECRETARIAT_DRH',
  'DRH',
  'ADMIN'
);

CREATE TYPE "DemandeStatus" AS ENUM (
  'SOUMIS',
  'EN_VERIFICATION',
  'REJETE_COURRIER',
  'VALIDEE_COURRIER',
  'EN_COURS_TRAITEMENT',
  'EN_ATTENTE_SIGNATURE',
  'SIGNE',
  'RETOUR_SECRETARIAT',
  'TRANSMIS_COURRIER',
  'DISPONIBLE',
  'RETIRE'
);

CREATE TYPE "TypeDemande" AS ENUM (
  'CONGE_MATERNITE',
  'ARRET_MALADIE',
  'PERMISSION',
  'ATTESTATION',
  'CERTIFICAT',
  'AUTRE'
);

-- ── 2. TABLES ─────────────────────────────────────────────

CREATE TABLE users (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  email         TEXT UNIQUE NOT NULL,
  password      TEXT NOT NULL,
  nom           TEXT NOT NULL,
  prenom        TEXT NOT NULL,
  role          "UserRole" NOT NULL DEFAULT 'AGENT',
  telephone     TEXT,
  matricule     TEXT UNIQUE,
  service       TEXT,
  fonction      TEXT,
  actif         BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE accounts (
  id                  TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "userId"            TEXT NOT NULL,
  type                TEXT NOT NULL,
  provider            TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  refresh_token       TEXT,
  access_token        TEXT,
  expires_at          INTEGER,
  token_type          TEXT,
  scope               TEXT,
  id_token            TEXT,
  session_state       TEXT,
  UNIQUE(provider, "providerAccountId"),
  FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE sessions (
  id             TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "sessionToken" TEXT UNIQUE NOT NULL,
  "userId"       TEXT NOT NULL,
  expires        TIMESTAMP(3) NOT NULL,
  FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE verification_tokens (
  identifier TEXT NOT NULL,
  token      TEXT UNIQUE NOT NULL,
  expires    TIMESTAMP(3) NOT NULL,
  UNIQUE(identifier, token)
);

CREATE TABLE demandes (
  id                     TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "numeroEnregistrement" TEXT UNIQUE,
  type                   "TypeDemande" NOT NULL,
  titre                  TEXT NOT NULL,
  motif                  TEXT,
  "dateDebut"            TIMESTAMP(3),
  "dateFin"              TIMESTAMP(3),
  statut                 "DemandeStatus" NOT NULL DEFAULT 'SOUMIS',
  commentaires           TEXT,
  "dateSoumission"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "dateValidation"       TIMESTAMP(3),
  "dateSignature"        TIMESTAMP(3),
  "dateDisponibilite"    TIMESTAMP(3),
  "dateRetrait"          TIMESTAMP(3),
  "agentId"              TEXT NOT NULL,
  "traiteParId"          TEXT,
  "createdAt"            TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"            TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("agentId") REFERENCES users(id),
  FOREIGN KEY ("traiteParId") REFERENCES users(id)
);

CREATE TABLE pieces_jointes (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  nom         TEXT NOT NULL,
  chemin      TEXT NOT NULL,
  type        TEXT NOT NULL,
  taille      INTEGER NOT NULL,
  "demandeId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("demandeId") REFERENCES demandes(id) ON DELETE CASCADE
);

CREATE TABLE history_logs (
  id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  action          TEXT NOT NULL,
  details         TEXT,
  "ancienStatut"  TEXT,
  "nouveauStatut" TEXT,
  "demandeId"     TEXT NOT NULL,
  "userId"        TEXT NOT NULL,
  "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("demandeId") REFERENCES demandes(id) ON DELETE CASCADE,
  FOREIGN KEY ("userId") REFERENCES users(id)
);

CREATE TABLE notifications (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  titre       TEXT NOT NULL,
  message     TEXT NOT NULL,
  lue         BOOLEAN NOT NULL DEFAULT FALSE,
  type        TEXT NOT NULL,
  "userId"    TEXT NOT NULL,
  "demandeId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY ("demandeId") REFERENCES demandes(id) ON DELETE SET NULL
);

CREATE TABLE registre_entrees (
  id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "numeroEntree"  TEXT UNIQUE NOT NULL,
  "dateEntree"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  provenance      TEXT NOT NULL,
  objet           TEXT NOT NULL,
  observations    TEXT,
  traite          BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE parametres (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  cle         TEXT UNIQUE NOT NULL,
  valeur      TEXT NOT NULL,
  description TEXT,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ── 3. AUTO-UPDATE updatedAt ──────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at       BEFORE UPDATE ON users           FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER demandes_updated_at    BEFORE UPDATE ON demandes         FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER registre_updated_at    BEFORE UPDATE ON registre_entrees FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER parametres_updated_at  BEFORE UPDATE ON parametres       FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── 4. SEED - Utilisateurs de démonstration ──────────────
-- Mots de passe :
--   admin@sports.gouv.ci     → admin123
--   agent@sports.gouv.ci     → agent123
--   courrier@sports.gouv.ci  → courrier123
--   secretariat@sports.gouv.ci → secret123
--   drh@sports.gouv.ci       → drh123

INSERT INTO users (id, email, password, nom, prenom, role, matricule, service, fonction) VALUES
(
  'usr_admin_001',
  'admin@sports.gouv.ci',
  '$2b$10$fmgP6PHqUs7QezjnNTx3Wusq9T.//fwqIwkkn85015agPaDiVxKE6',
  'Admin', 'Système', 'ADMIN', 'ADM001', 'DSI', 'Administrateur Système'
),
(
  'usr_agent_001',
  'agent@sports.gouv.ci',
  '$2b$10$j6R//NWf926yqg4K1rge8OguRSnPQETW8DP4Ig70Sq/Yt8HRbkRq.',
  'Kouassi', 'Jean-Baptiste', 'AGENT', 'AGT001', 'Direction Technique', 'Entraîneur National'
),
(
  'usr_courrier_001',
  'courrier@sports.gouv.ci',
  '$2b$10$5W0Jc2QF9Hqdcvuh.8w50O7nm1sUQZVoy3XUmy5wRAz5rRzd/9BHK',
  'Diallo', 'Fatou', 'SERVICE_COURRIER', 'COUR001', 'Service Courrier', 'Agent de Courrier'
),
(
  'usr_secretariat_001',
  'secretariat@sports.gouv.ci',
  '$2b$10$F23tVVdGp1jAGh0HfcaOqedhzypdaMyjUSetOXlOa.aJ3Zhg0Iz.a',
  'Kone', 'Aminata', 'SECRETARIAT_DRH', 'SEC001', 'Secrétariat DRH', 'Secrétaire Administrative'
),
(
  'usr_drh_001',
  'drh@sports.gouv.ci',
  '$2b$10$tH4OlAT17kCztxkzWEJXYutzkBN4QG2hiEXKW8nbZ4USt2ZR44kmS',
  'Ouattara', 'Dr. Moussa', 'DRH', 'DRH001', 'Direction RH', 'Directeur des Ressources Humaines'
);

-- ============================================================
-- FIN DU SCRIPT
-- Comptes de démonstration disponibles :
--   admin@sports.gouv.ci       / admin123
--   agent@sports.gouv.ci       / agent123
--   courrier@sports.gouv.ci    / courrier123
--   secretariat@sports.gouv.ci / secret123
--   drh@sports.gouv.ci         / drh123
-- ============================================================
