package tn.fst.projet.repository;
import tn.fst.projet.entity.Classe;
import tn.fst.projet.entity.Niveau;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ClasseRepository extends JpaRepository<Classe, Integer> {
    Classe findByTitre(String titre);
    List<Classe> findByNiveau(Niveau niveau);
}