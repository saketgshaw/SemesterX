@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService service;

    @GetMapping
    public ResponseEntity<List<Department>> getDepartments() {

        return ResponseEntity.ok(

                service.getAllDepartments()

        );

    }

}