package tn.fst.projet.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Classe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // ✅ Auto-généré IDENTITY
    private Integer codeClasse;

    private String titre;

    @Enumerated(EnumType.STRING)  // ✅ Stocké comme String en BDD
    private Niveau niveau;

    // ✅ Relation bidirectionnelle One-To-Many avec CoursClassroom
    // Une Classe peut avoir plusieurs CoursClassroom
    @OneToMany(mappedBy = "classe", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<CoursClassroom> coursClassrooms = new ArrayList<>();

    // ✅ Relation Many-To-Many avec Utilisateur
    @ManyToMany
    @JoinTable(
            name = "classe_utilisateur",
            joinColumns = @JoinColumn(name = "codeClasse"),
            inverseJoinColumns = @JoinColumn(name = "idUtilisateur")
    )
    private List<Utilisateur> utilisateurs = new ArrayList<>();
}