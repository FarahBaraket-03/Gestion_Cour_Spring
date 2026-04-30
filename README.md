# 🎓 FST Gestion - Système de Gestion des Cours et Classes

Application web full-stack pour la gestion des cours, classes et utilisateurs dans un établissement d'enseignement supérieur (FST - Faculté des Sciences de Tunis).

![Architecture](https://img.shields.io/badge/Architecture-Full%20Stack-blue)
![Backend](https://img.shields.io/badge/Backend-Spring%20Boot%203.3-green)
![Frontend](https://img.shields.io/badge/Frontend-React%2019-61dafb)
![Database](https://img.shields.io/badge/Database-MySQL-orange)

---

<img width="1902" height="870" alt="image" src="https://github.com/user-attachments/assets/37a8f866-ff2e-4fe1-b5ff-c4fc16075e44" />


## 📋 Table des matières

- [Vue d'ensemble](#-vue-densemble)
- [Architecture](#-architecture)
- [Technologies](#-technologies)
- [Modèle de données](#-modèle-de-données)
- [API Endpoints](#-api-endpoints)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Utilisation](#-utilisation)
- [Fonctionnalités](#-fonctionnalités)
- [Structure du projet](#-structure-du-projet)

---

## 🎯 Vue d'ensemble

**FST Gestion** est une application de gestion académique permettant de :
- Gérer les **utilisateurs** (étudiants et administrateurs)
- Créer et organiser des **classes** par niveau
- Administrer des **cours** avec spécialités et heures
- **Affecter** des utilisateurs aux classes
- **Affecter** des cours aux classes
- Visualiser des **statistiques** en temps réel

---

## 🏗️ Architecture

### Architecture Globale

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         React 19 + TypeScript + Vite                   │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐            │ │
│  │  │  Pages   │  │Components│  │   API    │            │ │
│  │  │ (Views)  │  │ (Sidebar)│  │ (Fetch)  │            │ │
│  │  └──────────┘  └──────────┘  └──────────┘            │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST (Port 8081)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Spring Boot 3.3 (Java 17)                 │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │ │
│  │  │ Controllers  │→ │   Services   │→ │Repositories │ │ │
│  │  │  (REST API)  │  │  (Business)  │  │    (JPA)    │ │ │
│  │  └──────────────┘  └──────────────┘  └─────────────┘ │ │
│  │                                                        │ │
│  │  ┌──────────────┐  ┌──────────────┐                  │ │
│  │  │   Entities   │  │    Config    │                  │ │
│  │  │   (Models)   │  │ (CORS/Swagger)│                 │ │
│  │  └──────────────┘  └──────────────┘                  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ JDBC (Port 3306)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       DATA LAYER                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    MySQL Database                      │ │
│  │                   (gestioncours)                       │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │ │
│  │  │ Utilisateur  │  │   Classe     │  │   Cours    │  │ │
│  │  └──────────────┘  └──────────────┘  └────────────┘  │ │
│  │           └──────────────┬──────────────┘             │ │
│  │                  classe_utilisateur                    │ │
│  │                   (Join Table)                         │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Architecture Backend (Layered Architecture)

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         GestionCoursController.java                    │ │
│  │  • @RestController                                     │ │
│  │  • Endpoints REST (/api/*)                             │ │
│  │  • Validation des requêtes                             │ │
│  │  • Sérialisation JSON                                  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      SERVICE LAYER                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │      IGestionCoursService (Interface)                  │ │
│  │      GestionCoursServiceImpl (Implementation)          │ │
│  │  • @Service                                            │ │
│  │  • Logique métier                                      │ │
│  │  • Transactions                                        │ │
│  │  • Orchestration                                       │ │
│  │  • Scheduled tasks (@Scheduled)                        │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    PERSISTENCE LAYER                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  UtilisateurRepository | ClasseRepository |            │ │
│  │  CoursClassroomRepository                              │ │
│  │  • @Repository                                         │ │
│  │  • JpaRepository<Entity, ID>                           │ │
│  │  • Custom queries (JPQL)                               │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       DOMAIN LAYER                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Entities: Utilisateur, Classe, CoursClassroom         │ │
│  │  Enums: Niveau, Specialite                             │ │
│  │  • @Entity                                             │ │
│  │  • Relations JPA (@ManyToOne, @OneToMany, @ManyToMany)│ │
│  │  • Lombok (@Data, @NoArgsConstructor)                  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Architecture Frontend (Component-Based)

```
┌─────────────────────────────────────────────────────────────┐
│                      APPLICATION ROOT                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    App.tsx                             │ │
│  │  • Routing logic (page switching)                      │ │
│  │  • State management (activePage)                       │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
           │                                    │
           ▼                                    ▼
┌──────────────────────┐          ┌──────────────────────────┐
│   LAYOUT COMPONENTS  │          │      PAGE COMPONENTS     │
│  ┌────────────────┐  │          │  ┌────────────────────┐ │
│  │  Sidebar.tsx   │  │          │  │  Dashboard.tsx     │ │
│  │  • Navigation  │  │          │  │  Utilisateurs.tsx  │ │
│  │  • Active page │  │          │  │  Classes.tsx       │ │
│  └────────────────┘  │          │  │  Cours.tsx         │ │
└──────────────────────┘          │  │  Affectations.tsx  │ │
                                  │  │  Stats.tsx         │ │
                                  │  └────────────────────┘ │
                                  └──────────────────────────┘
                                             │
                                             ▼
                                  ┌──────────────────────────┐
                                  │     UTILITY LAYER        │
                                  │  ┌────────────────────┐  │
                                  │  │    api.ts          │  │
                                  │  │  • apiFetch()      │  │
                                  │  │  • API constants   │  │
                                  │  │  • Color mappings  │  │
                                  │  └────────────────────┘  │
                                  └──────────────────────────┘
```

---

## 🛠️ Technologies

### Backend
| Technologie | Version | Usage |
|------------|---------|-------|
| **Java** | 17 | Langage principal |
| **Spring Boot** | 3.3.0 | Framework backend |
| **Spring Data JPA** | 3.3.0 | ORM et persistence |
| **MySQL Connector** | Latest | Driver JDBC |
| **Lombok** | Latest | Réduction du boilerplate |
| **SpringDoc OpenAPI** | 2.3.0 | Documentation API (Swagger) |
| **Maven** | 3.x | Gestion des dépendances |

### Frontend
| Technologie | Version | Usage |
|------------|---------|-------|
| **React** | 19.0.1 | Framework UI |
| **TypeScript** | 5.8.2 | Typage statique |
| **Vite** | 6.2.3 | Build tool & dev server |
| **Tailwind CSS** | 4.1.14 | Styling |
| **Lucide React** | 0.546.0 | Icônes |
| **Motion** | 12.23.24 | Animations |

### Base de données
| Technologie | Version | Usage |
|------------|---------|-------|
| **MySQL** | 8.x | Base de données relationnelle |

---

## 📊 Modèle de données

### Diagramme Entité-Association

```
┌─────────────────────┐
│   Utilisateur       │
├─────────────────────┤
│ PK idUtilisateur    │
│    prenom           │
│    nom              │
│    password         │
└─────────────────────┘
          │
          │ Many-to-Many
          │
          ▼
┌─────────────────────────────┐
│  classe_utilisateur         │
│  (Join Table)               │
├─────────────────────────────┤
│ FK codeClasse               │
│ FK idUtilisateur            │
└─────────────────────────────┘
          │
          │
          ▼
┌─────────────────────┐         ┌─────────────────────┐
│      Classe         │         │   CoursClassroom    │
├─────────────────────┤         ├─────────────────────┤
│ PK codeClasse       │◄────────│ PK idCours          │
│    titre            │ One     │    nom              │
│    niveau (ENUM)    │   to    │    specialite (ENUM)│
└─────────────────────┘  Many   │    nbHeures         │
                                │    archive          │
                                │ FK codeClasse       │
                                └─────────────────────┘
```

### Relations détaillées

#### 1. **Utilisateur** ↔ **Classe** (Many-to-Many)
- Un utilisateur peut être inscrit dans plusieurs classes
- Une classe peut contenir plusieurs utilisateurs
- Table de jointure : `classe_utilisateur`

#### 2. **Classe** ↔ **CoursClassroom** (One-to-Many)
- Une classe peut avoir plusieurs cours
- Un cours appartient à une seule classe (ou aucune si `codeClasse = null`)
- Relation bidirectionnelle avec `@ManyToOne` et `@OneToMany`

### Enums

#### **Niveau**
```java
PREMIERE, DEUXIEME, TROISIEME, QUATRIEME, CINQUIEME
```

#### **Specialite**
```java
INFORMATIQUE, GENIECIVIL, AGRICULTURE
```

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:8081/api
```

### Utilisateurs

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/utilisateurs` | Créer un utilisateur |
| `PUT` | `/utilisateurs` | Modifier un utilisateur |
| `DELETE` | `/utilisateurs/{id}` | Supprimer un utilisateur |
| `GET` | `/utilisateurs/{id}` | Récupérer un utilisateur |
| `GET` | `/utilisateurs` | Lister tous les utilisateurs |

### Classes

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/classes` | Créer une classe |
| `PUT` | `/classes` | Modifier une classe |
| `DELETE` | `/classes/{id}` | Supprimer une classe |
| `GET` | `/classes/{id}` | Récupérer une classe |
| `GET` | `/classes` | Lister toutes les classes |

### Cours

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/cours?codeClasse={id}` | Créer un cours et l'affecter |
| `PUT` | `/cours` | Modifier un cours |
| `DELETE` | `/cours/{id}` | Supprimer un cours |
| `GET` | `/cours/{id}` | Récupérer un cours |
| `GET` | `/cours` | Lister tous les cours |

### Affectations

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/affecter?idUtilisateur={id}&codeClasse={code}` | Affecter un utilisateur à une classe |
| `PUT` | `/cours/affecter/{idCours}?codeClasse={code}` | Affecter un cours à une classe |
| `PUT` | `/cours/desaffecter/{idCours}` | Désaffecter un cours de sa classe |

### Statistiques

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/utilisateurs/niveau?nv={niveau}` | Nombre d'utilisateurs par niveau |
| `GET` | `/cours/heures?sp={specialite}&nv={niveau}` | Nombre d'heures par spécialité et niveau |

### Documentation API (Swagger)
```
http://localhost:8081/swagger-ui.html
```

---

## 📦 Installation

### Prérequis

- **Java 17+** ([Télécharger](https://www.oracle.com/java/technologies/downloads/))
- **Maven 3.x** ([Télécharger](https://maven.apache.org/download.cgi))
- **Node.js 18+** ([Télécharger](https://nodejs.org/))
- **MySQL 8.x** ([Télécharger](https://dev.mysql.com/downloads/))

### 1. Cloner le projet

```bash
git clone <repository-url>
cd fst-gestion
```

### 2. Configuration de la base de données

Créer la base de données MySQL :

```sql
CREATE DATABASE gestioncours;
```

### 3. Installation Backend

```bash
cd Backend/projet

# Installer les dépendances
mvn clean install

# Lancer l'application
mvn spring-boot:run
```

Le backend sera accessible sur : **http://localhost:8081**

### 4. Installation Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Le frontend sera accessible sur : **http://localhost:3000**

---

## ⚙️ Configuration

### Backend (`application.properties`)

```properties
# Application
spring.application.name=projet
server.port=8081

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/gestioncours?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# Swagger
springdoc.api-docs.path=/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
springdoc.swagger-ui.enabled=true
```

### Frontend (`api.ts`)

```typescript
export const API = 'http://localhost:8081/api';
```

### CORS Configuration

Le backend est configuré pour accepter les requêtes depuis :
- `http://localhost:3000` (Frontend dev)
- `http://localhost:5173` (Vite alternative port)

---

## 🚀 Utilisation

### 1. Démarrer l'application

**Terminal 1 - Backend :**
```bash
cd Backend/projet
mvn spring-boot:run
```

**Terminal 2 - Frontend :**
```bash
cd frontend
npm run dev
```

### 2. Accéder à l'application

- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:8081/api
- **Swagger UI** : http://localhost:8081/swagger-ui.html

### 3. Workflow typique

1. **Créer des utilisateurs** (page Utilisateurs)
2. **Créer des classes** (page Classes)
3. **Créer des cours** et les affecter aux classes (page Cours)
4. **Affecter des utilisateurs aux classes** (page Affectations)
5. **Affecter des cours non affectés** (page Affectations)
6. **Consulter les statistiques** (page Stats)

---

## ✨ Fonctionnalités

### 📊 Dashboard
- Vue d'ensemble du système
- Statistiques en temps réel
- Cartes récapitulatives

### 👥 Gestion des Utilisateurs
- ✅ Créer un utilisateur (prénom, nom, mot de passe)
- ✅ Lister tous les utilisateurs
- ✅ Supprimer un utilisateur
- ✅ Modifier un utilisateur

### 🏫 Gestion des Classes
- ✅ Créer une classe (titre, niveau)
- ✅ Lister toutes les classes
- ✅ Supprimer une classe
- ✅ Modifier une classe
- ✅ Filtrage par niveau (PREMIERE à CINQUIEME)

### 📚 Gestion des Cours
- ✅ Créer un cours (nom, spécialité, nb heures)
- ✅ Affecter un cours à une classe lors de la création
- ✅ Lister tous les cours
- ✅ Supprimer un cours
- ✅ Modifier un cours
- ✅ Désaffecter un cours de sa classe
- ✅ Affecter un cours non affecté à une classe
- ✅ Archivage automatique (tâche planifiée)

### 🔗 Affectations
- ✅ Affecter un utilisateur à une classe
- ✅ Affecter un cours (classe = null) à une classe
- ✅ Visualiser les cours non affectés
- ✅ Interface intuitive avec sélecteurs

### 📈 Statistiques
- ✅ Nombre d'utilisateurs par niveau
- ✅ Nombre d'heures par spécialité et niveau
- ✅ Visualisation graphique (à venir)

### 🔄 Fonctionnalités techniques
- ✅ CORS configuré pour le développement
- ✅ Documentation API avec Swagger
- ✅ Validation des données
- ✅ Gestion des erreurs
- ✅ Hot Module Replacement (HMR)
- ✅ Responsive design
- ✅ Tâches planifiées (@Scheduled)

---

## 📁 Structure du projet

```
fst-gestion/
│
├── Backend/
│   └── projet/
│       ├── src/
│       │   ├── main/
│       │   │   ├── java/tn/fst/projet/
│       │   │   │   ├── Config/
│       │   │   │   │   ├── CorsConfig.java
│       │   │   │   │   └── SwaggerConfig.java
│       │   │   │   ├── controller/
│       │   │   │   │   └── GestionCoursController.java
│       │   │   │   ├── entity/
│       │   │   │   │   ├── Utilisateur.java
│       │   │   │   │   ├── Classe.java
│       │   │   │   │   ├── CoursClassroom.java
│       │   │   │   │   ├── Niveau.java (enum)
│       │   │   │   │   └── Specialite.java (enum)
│       │   │   │   ├── repository/
│       │   │   │   │   ├── UtilisateurRepository.java
│       │   │   │   │   ├── ClasseRepository.java
│       │   │   │   │   └── CoursClassroomRepository.java
│       │   │   │   ├── service/
│       │   │   │   │   ├── IGestionCoursService.java
│       │   │   │   │   └── GestionCoursServiceImpl.java
│       │   │   │   └── ProjetApplication.java
│       │   │   └── resources/
│       │   │       └── application.properties
│       │   └── test/
│       ├── pom.xml
│       └── mvnw
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Sidebar.tsx
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Utilisateurs.tsx
│   │   │   ├── Classes.tsx
│   │   │   ├── Cours.tsx
│   │   │   ├── Affectations.tsx
│   │   │   └── Stats.tsx
│   │   ├── lib/
│   │   │   └── api.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── index.html
│
└── README.md
```

---

## 🔐 Sécurité

⚠️ **Note importante** : Cette application est un prototype de développement.

Pour une utilisation en production, il est recommandé d'ajouter :
- Authentification JWT
- Hashage des mots de passe (BCrypt)
- Validation des entrées côté serveur
- HTTPS
- Rate limiting
- Gestion des rôles et permissions

---

## 🐛 Dépannage

### Backend ne démarre pas
- Vérifier que MySQL est en cours d'exécution
- Vérifier les credentials dans `application.properties`
- Vérifier que le port 8081 est disponible

### Frontend ne se connecte pas au backend
- Vérifier que le backend est démarré
- Vérifier l'URL de l'API dans `api.ts`
- Vérifier la configuration CORS

### Erreur de compilation Maven
```bash
mvn clean install -U
```

### Erreur de dépendances npm
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📝 Licence

Ce projet est développé à des fins éducatives pour la FST (Faculté des Sciences de Tunis).

---

## 👥 Contributeurs

Développé avec ❤️ pour la gestion académique de la FST.

---

## 📞 Support

Pour toute question ou problème :
- Consulter la documentation Swagger : http://localhost:8081/swagger-ui.html
- Vérifier les logs du backend dans la console
- Vérifier les logs du frontend dans la console du navigateur (F12)

---

**Version** : 1.0.0  
**Dernière mise à jour** : 2026
