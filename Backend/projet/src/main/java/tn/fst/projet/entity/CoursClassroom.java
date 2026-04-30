package tn.fst.projet.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CoursClassroom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // ✅ Auto-généré IDENTITY
    private Integer idCours;

    @Enumerated(EnumType.STRING)  // ✅ Stocké comme String en BDD
    private Specialite specialite;

    private String nom;
    private Integer nbHeures;
    private Boolean archive;

    // ✅ Relation bidirectionnelle Many-To-One avec Classe
    // Un CoursClassroom appartient à une seule Classe
    @ManyToOne
    @JoinColumn(name = "codeClasse")
    @JsonBackReference
    private Classe classe;
}