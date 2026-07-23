@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl
        implements DepartmentService {

    private final DepartmentRepository repository;

    @Override
    public List<Department> getAllDepartments() {

        return repository.findAll();

    }

}