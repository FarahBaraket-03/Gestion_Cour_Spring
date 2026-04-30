package tn.fst.projet.service;

import tn.fst.projet.entity.*;
import java.util.List;

public interface IGestionCoursService {

    // Utilisateur
    Utilisateur ajouterUtilisateur(Utilisateur utilisateur);
    Utilisateur modifierUtilisateur(Utilisateur utilisateur);
    void supprimerUtilisateur(Integer idUtilisateur);
    Utilisateur getUtilisateur(Integer idUtilisateur);
    List<Utilisateur> getAllUtilisateurs();

    // Classe
    Classe ajouterClasse(Classe c);
    Classe modifierClasse(Classe c);
    void supprimerClasse(Integer codeClasse);
    Classe getClasse(Integer codeClasse);
    List<Classe> getAllClasses();

    // CoursClassroom
    CoursClassroom ajouterCoursClassroom(CoursClassroom cc, Integer codeClasse);
    CoursClassroom modifierCoursClassroom(CoursClassroom cc);
    void supprimerCoursClassroom(Integer idCours);
    CoursClassroom getCoursClassroom(Integer idCours);
    List<CoursClassroom> getAllCoursClassrooms();

    // Méthodes métier
    void affecterUtilisateurClasse(Integer idUtilisateur, Integer codeClasse);
    Integer nbUtilisateursParNiveau(Niveau nv);
    void desaffecterCoursClassroomClasse(Integer idCours);
    void affecterCoursClassroomClasse(Integer idCours, Integer codeClasse);
    void archiverCoursClassrooms();
    Integer nbHeuresParSpecEtNiv(Specialite sp, Niveau nv);
}