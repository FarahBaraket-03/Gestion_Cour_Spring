package tn.fst.projet.controller;

import tn.fst.projet.entity.*;
import tn.fst.projet.service.IGestionCoursService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class GestionCoursController {

    private final IGestionCoursService service;

    // ══════════════════════════════════════════
    //            Utilisateur
    // ══════════════════════════════════════════

    // a) Ajouter un utilisateur
    @PostMapping("/utilisateurs")
    public Utilisateur ajouterUtilisateur(@RequestBody Utilisateur utilisateur) {
        return service.ajouterUtilisateur(utilisateur);
    }

    @PutMapping("/utilisateurs")
    public Utilisateur modifierUtilisateur(@RequestBody Utilisateur utilisateur) {
        return service.modifierUtilisateur(utilisateur);
    }

    @DeleteMapping("/utilisateurs/{id}")
    public void supprimerUtilisateur(@PathVariable Integer id) {
        service.supprimerUtilisateur(id);
    }

    @GetMapping("/utilisateurs/{id}")
    public Utilisateur getUtilisateur(@PathVariable Integer id) {
        return service.getUtilisateur(id);
    }

    @GetMapping("/utilisateurs")
    public List<Utilisateur> getAllUtilisateurs() {
        return service.getAllUtilisateurs();
    }

    // ══════════════════════════════════════════
    //               Classe
    // ══════════════════════════════════════════

    // b) Ajouter une classe
    @PostMapping("/classes")
    public Classe ajouterClasse(@RequestBody Classe c) {
        return service.ajouterClasse(c);
    }

    @PutMapping("/classes")
    public Classe modifierClasse(@RequestBody Classe c) {
        return service.modifierClasse(c);
    }

    @DeleteMapping("/classes/{id}")
    public void supprimerClasse(@PathVariable Integer id) {
        service.supprimerClasse(id);
    }

    @GetMapping("/classes/{id}")
    public Classe getClasse(@PathVariable Integer id) {
        return service.getClasse(id);
    }

    @GetMapping("/classes")
    public List<Classe> getAllClasses() {
        return service.getAllClasses();
    }

    // ══════════════════════════════════════════
    //           CoursClassroom
    // ══════════════════════════════════════════

    // c) Ajouter un cours affecté à une classe
    @PostMapping("/cours")
    public CoursClassroom ajouterCours(@RequestBody CoursClassroom cc,
                                       @RequestParam Integer codeClasse) {
        return service.ajouterCoursClassroom(cc, codeClasse);
    }

    @PutMapping("/cours")
    public CoursClassroom modifierCours(@RequestBody CoursClassroom cc) {
        return service.modifierCoursClassroom(cc);
    }

    @DeleteMapping("/cours/{id}")
    public void supprimerCours(@PathVariable Integer id) {
        service.supprimerCoursClassroom(id);
    }

    @GetMapping("/cours/{id}")
    public CoursClassroom getCours(@PathVariable Integer id) {
        return service.getCoursClassroom(id);
    }

    @GetMapping("/cours")
    public List<CoursClassroom> getAllCours() {
        return service.getAllCoursClassrooms();
    }

    // ══════════════════════════════════════════
    //            Méthodes métier
    // ══════════════════════════════════════════

    // d) Affecter un utilisateur à une classe
    @PostMapping("/affecter")
    public void affecterUtilisateurClasse(@RequestParam Integer idUtilisateur,
                                          @RequestParam Integer codeClasse) {
        service.affecterUtilisateurClasse(idUtilisateur, codeClasse);
    }

    // e) Nombre d'utilisateurs par niveau
    @GetMapping("/utilisateurs/niveau")
    public Integer nbUtilisateursParNiveau(@RequestParam Niveau nv) {
        return service.nbUtilisateursParNiveau(nv);
    }

    // f) Désaffecter un cours de sa classe
    @PutMapping("/cours/desaffecter/{idCours}")
    public void desaffecterCoursClassroomClasse(@PathVariable Integer idCours) {
        service.desaffecterCoursClassroomClasse(idCours);
    }

    // g) Affecter un cours (avec code classe null) à une classe
    @PutMapping("/cours/affecter/{idCours}")
    public void affecterCoursClassroomClasse(@PathVariable Integer idCours,
                                             @RequestParam Integer codeClasse) {
        service.affecterCoursClassroomClasse(idCours, codeClasse);
    }

    // h) Nombre d'heures par spécialité et niveau
    @GetMapping("/cours/heures")
    public Integer nbHeuresParSpecEtNiv(@RequestParam Specialite sp,
                                        @RequestParam Niveau nv) {
        return service.nbHeuresParSpecEtNiv(sp, nv);
    }
}