package tn.fst.projet.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // ✅ Auto-généré IDENTITY
    private Integer idUtilisateur;

    private String prenom;
    private String nom;
    private String password;
}