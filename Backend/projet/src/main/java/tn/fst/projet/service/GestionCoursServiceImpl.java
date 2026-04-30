package tn.fst.projet.service;

import tn.fst.projet.entity.*;
import tn.fst.projet.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GestionCoursServiceImpl implements IGestionCoursService {

    private final UtilisateurRepository utilisateurRepo;
    private final ClasseRepository classeRepo;
    private final CoursClassroomRepository coursRepo;

    // ══════════════════════════════════════════
    //            CRUD Utilisateur
    // ══════════════════════════════════════════

    @Override
    public Utilisateur ajouterUtilisateur(Utilisateur utilisateur) {
        return utilisateurRepo.save(utilisateur);
    }

    @Override
    public Utilisateur modifierUtilisateur(Utilisateur utilisateur) {
        return utilisateurRepo.save(utilisateur);
    }

    @Override
    public void supprimerUtilisateur(Integer idUtilisateur) {
        utilisateurRepo.deleteById(idUtilisateur);
    }

    @Override
    public Utilisateur getUtilisateur(Integer idUtilisateur) {
        return utilisateurRepo.findById(idUtilisateur)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé : " + idUtilisateur));
    }

    @Override
    public List<Utilisateur> getAllUtilisateurs() {
        return utilisateurRepo.findAll();
    }

    // ══════════════════════════════════════════
    //               CRUD Classe
    // ══════════════════════════════════════════

    @Override
    public Classe ajouterClasse(Classe c) {
        return classeRepo.save(c);
    }

    @Override
    public Classe modifierClasse(Classe c) {
        return classeRepo.save(c);
    }

    @Override
    public void supprimerClasse(Integer codeClasse) {
        classeRepo.deleteById(codeClasse);
    }

    @Override
    public Classe getClasse(Integer codeClasse) {
        return classeRepo.findById(codeClasse)
                .orElseThrow(() -> new RuntimeException("Classe non trouvée : " + codeClasse));
    }

    @Override
    public List<Classe> getAllClasses() {
        return classeRepo.findAll();
    }

    // ══════════════════════════════════════════
    //           CRUD CoursClassroom
    // ══════════════════════════════════════════

    @Override
    public CoursClassroom ajouterCoursClassroom(CoursClassroom cc, Integer codeClasse) {
        Classe classe = classeRepo.findById(codeClasse)
                .orElseThrow(() -> new RuntimeException("Classe non trouvée : " + codeClasse));
        cc.setClasse(classe);
        return coursRepo.save(cc);
    }

    @Override
    public CoursClassroom modifierCoursClassroom(CoursClassroom cc) {
        return coursRepo.save(cc);
    }

    @Override
    public void supprimerCoursClassroom(Integer idCours) {
        coursRepo.deleteById(idCours);
    }

    @Override
    public CoursClassroom getCoursClassroom(Integer idCours) {
        return coursRepo.findById(idCours)
                .orElseThrow(() -> new RuntimeException("Cours non trouvé : " + idCours));
    }

    @Override
    public List<CoursClassroom> getAllCoursClassrooms() {
        return coursRepo.findAll();
    }

    // ══════════════════════════════════════════
    //            Méthodes métier
    // ══════════════════════════════════════════

    @Override
    public void affecterUtilisateurClasse(Integer idUtilisateur, Integer codeClasse) {
        Utilisateur u = utilisateurRepo.findById(idUtilisateur)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé : " + idUtilisateur));
        Classe c = classeRepo.findById(codeClasse)
                .orElseThrow(() -> new RuntimeException("Classe non trouvée : " + codeClasse));
        c.getUtilisateurs().add(u);
        classeRepo.save(c);
    }

    @Override
    public Integer nbUtilisateursParNiveau(Niveau nv) {
        List<Classe> classes = classeRepo.findByNiveau(nv);
        return classes.stream()
                .mapToInt(c -> c.getUtilisateurs().size())
                .sum();
    }

    @Override
    public void desaffecterCoursClassroomClasse(Integer idCours) {
        CoursClassroom cc = coursRepo.findById(idCours)
                .orElseThrow(() -> new RuntimeException("Cours non trouvé : " + idCours));
        cc.setClasse(null);
        coursRepo.save(cc);
    }

    @Override
    public void affecterCoursClassroomClasse(Integer idCours, Integer codeClasse) {
        CoursClassroom cc = coursRepo.findById(idCours)
                .orElseThrow(() -> new RuntimeException("Cours non trouvé : " + idCours));
        Classe classe = classeRepo.findById(codeClasse)
                .orElseThrow(() -> new RuntimeException("Classe non trouvée : " + codeClasse));
        cc.setClasse(classe);
        coursRepo.save(cc);
    }

    @Override
    @Scheduled(fixedRate = 60000)
    public void archiverCoursClassrooms() {
        List<CoursClassroom> cours = coursRepo.findAll();
        cours.forEach(c -> c.setArchive(true));
        coursRepo.saveAll(cours);
        System.out.println(">>> Archivage automatique effectué !");
    }

    @Override
    public Integer nbHeuresParSpecEtNiv(Specialite sp, Niveau nv) {
        return coursRepo.findByClasseNiveauAndSpecialite(nv, sp)
                .stream()
                .mapToInt(CoursClassroom::getNbHeures)
                .sum();
    }
}