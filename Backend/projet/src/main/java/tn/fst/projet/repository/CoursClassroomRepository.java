package tn.fst.projet.repository;

import tn.fst.projet.entity.CoursClassroom;
import tn.fst.projet.entity.Niveau;
import tn.fst.projet.entity.Specialite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CoursClassroomRepository extends JpaRepository<CoursClassroom, Integer> {
    List<CoursClassroom> findByClasseNiveauAndSpecialite(Niveau niveau, Specialite specialite);
}