package kz.saphena.api.controller

import kz.saphena.api.configuration.security.OrganizationContext
import kz.saphena.api.dto.schedule.CreateExceptionRequest
import kz.saphena.api.dto.schedule.CreateWorkScheduleRequest
import kz.saphena.api.dto.schedule.ExceptionDto
import kz.saphena.api.dto.schedule.UpdateWorkScheduleRequest
import kz.saphena.api.dto.schedule.WorkScheduleDto
import kz.saphena.api.dto.schedule.WorkScheduleSlotDto
import kz.saphena.api.service.ScheduleService
import org.slf4j.LoggerFactory
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException
import java.time.LocalDate
import java.util.UUID

@RestController
@RequestMapping("/api/schedules")
class ScheduleController(
    private val scheduleService: ScheduleService
) {
    private val logger = LoggerFactory.getLogger(ScheduleController::class.java)
    
    /**
     * Create a new work schedule for a doctor.
     *
     * @param request the work schedule details
     * @return the created work schedule
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createWorkSchedule(
        @RequestBody request: CreateWorkScheduleRequest
    ): ResponseEntity<WorkScheduleDto> {
        if (request.endDate != null && request.endDate.isBefore(request.startDate)) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "endDate should be after startDate")
        }
        logger.info("Creating work schedule: $request")

        val schedule = scheduleService.createWorkSchedule(request)
        
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(WorkScheduleDto.from(schedule))
    }
    
    /**
     * Get all work schedules for a doctor.
     *
     * @param orgUserId the ID of the organization user (doctor in organization)
     * @param includePatterns whether to include patterns in the response
     * @return a list of work schedules
     */
    @GetMapping
    fun getWorkSchedules(
        @RequestParam orgUserId: UUID,
        @RequestParam(required = false) includePatterns: Boolean,
    ): ResponseEntity<List<WorkScheduleDto>> {
        logger.info("Getting work schedules for doctor: $orgUserId")
        val schedules = scheduleService.getWorkSchedules(orgUserId)
            .map { WorkScheduleDto.from(it, includePatterns) }
        return ResponseEntity.ok(schedules)
    }
    
    /**
     * Get a specific work schedule by ID.
     *
     * @param scheduleId the ID of the schedule
     * @return the work schedule with its patterns
     */
    @GetMapping("/{scheduleId}")
    fun getWorkSchedule(
        @PathVariable scheduleId: UUID
    ): ResponseEntity<WorkScheduleDto> {
        logger.info("Getting work schedule: $scheduleId")

        // Find the schedule in the repository
        val schedule = scheduleService.getWorkScheduleById(scheduleId)
            ?: return ResponseEntity.notFound().build()
        
        // Create DTO with patterns
        val scheduleDto = WorkScheduleDto.from(schedule)
        
        return ResponseEntity.ok(scheduleDto)
    }
    
    /**
     * Update an existing work schedule.
     *
     * @param scheduleId the ID of the schedule to update
     * @param request the updated work schedule details
     * @return the updated work schedule
     */
    @PutMapping
    fun updateWorkSchedule(
        @RequestBody request: UpdateWorkScheduleRequest
    ): ResponseEntity<WorkScheduleDto> {
        logger.info("Updating work schedule with request: $request")

        // Update the schedule
        val updatedSchedule = scheduleService.updateWorkSchedule(request)
            ?: return ResponseEntity.notFound().build()
        
        return ResponseEntity.ok(WorkScheduleDto.from(updatedSchedule))
    }
    
    /**
     * Delete a work schedule.
     *
     * @param scheduleId the ID of the schedule to delete
     * @return no content if successful, not found if the schedule doesn't exist
     */
    @DeleteMapping("/{scheduleId}")
    fun deleteWorkSchedule(
        @PathVariable scheduleId: UUID
    ): ResponseEntity<Void> {
        logger.info("Deleting work schedule: $scheduleId")
        val organizationId = OrganizationContext.getCurrentOrganizationId()
        
        val deleted = scheduleService.deleteWorkSchedule(scheduleId, organizationId)
        
        return if (deleted) {
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }
    
    /**
     * Get active work schedules for a doctor on a specific date.
     *
     * @param orgUserId the ID of the organization user (doctor in organization)
     * @param date the date to check
     * @return a list of active work schedules for the doctor on the given date
     */
    @GetMapping("/active")
    fun getActiveWorkSchedules(
        @RequestParam orgUserId: UUID,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) date: LocalDate
    ): ResponseEntity<List<WorkScheduleDto>> {
        logger.info("Getting active work schedules for doctor: $orgUserId on date: $date")
        val schedules = scheduleService.getActiveWorkSchedulesForDate(orgUserId, date)
            .map { WorkScheduleDto.from(it, includePatterns = false) }
        return ResponseEntity.ok(schedules)
    }
    
    /**
     * Get availability slots for a doctor within a specified date range.
     * No merging with appointments is performed.
     *
     * Semantics (matches current service implementation):
     * - from is inclusive
     * - to is inclusive
     * - schedule date range is treated as inclusive on both ends
     * - exception date range is treated as inclusive on both ends
     *
     * @param orgUserId the ID of the organization user (doctor in organization)
     * @param from the start date (inclusive)
     * @param to the end date (inclusive)
     * @return a list of work schedule slots overlapping the given date range
     */
    @GetMapping("/availability")
    fun getAvailability(
        @RequestParam orgUserId: UUID,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) from: LocalDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) to: LocalDate,
    ): ResponseEntity<List<WorkScheduleSlotDto>> {
        val slots = scheduleService.getAvailability(orgUserId, from, to)
        return ResponseEntity.ok(slots)
    }

    /**
     * Add a schedule exception for a doctor.
     *
     * @param exceptionDto the exception creation request
     * @return the created schedule exception
     */
    @PostMapping("/exceptions")
    @ResponseStatus(HttpStatus.CREATED)
    fun addException(
        @RequestBody exceptionDto: CreateExceptionRequest
    ): ResponseEntity<ExceptionDto> {
        // Use the existing method with individual parameters
        val exception = scheduleService.addException(exceptionDto)
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ExceptionDto.from(exception))
    }

    /**
     * Get all schedule exceptions for a doctor.
     *
     * @param orgUserId the ID of the organization user (doctor in organization)
     * @return a list of schedule exceptions
     */
    @GetMapping("/exceptions")
    fun getExceptions(
        @RequestParam orgUserId: UUID,
    ): ResponseEntity<List<ExceptionDto>> {
        val exceptions = scheduleService.getExceptions(orgUserId)
            .map { ExceptionDto.from(it) }
        return ResponseEntity.ok(exceptions)
    }
}
