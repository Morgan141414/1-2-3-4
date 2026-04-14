package kz.saphena.api.service

import kz.saphena.api.dto.schedule.CreateExceptionRequest
import kz.saphena.api.dto.schedule.CreateWorkScheduleRequest
import kz.saphena.api.dto.schedule.UpdateWorkScheduleRequest
import kz.saphena.api.dto.schedule.WorkScheduleSlotDto
import kz.saphena.api.model.schedule.ScheduleException
import kz.saphena.api.model.schedule.WorkPatternEntity
import kz.saphena.api.model.schedule.WorkScheduleEntity
import kz.saphena.api.repository.doctor.DoctorRepository
import kz.saphena.api.repository.doctor.ScheduleExceptionRepository
import kz.saphena.api.repository.doctor.WorkPatternRepository
import kz.saphena.api.repository.doctor.WorkScheduleRepository
import kz.saphena.api.repository.organization.OrganizationRepository
import kz.saphena.api.repository.organization.OrganizationUserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import java.time.LocalDateTime
import java.util.UUID

@Service
class ScheduleService(
    private val doctorRepository: DoctorRepository,
    private val workPatternRepository: WorkPatternRepository,
    private val workScheduleRepository: WorkScheduleRepository,
    private val scheduleExceptionRepository: ScheduleExceptionRepository,
    private val organizationRepository: OrganizationRepository,
    private val organizationUserRepository: OrganizationUserRepository,
) {
    /**
     * Validates that a doctor belongs to an organization.
     *
     * @param doctorId the ID of the doctor
     * @param organizationId the ID of the organization
     * @throws IllegalArgumentException if the doctor doesn't belong to the organization
     */
    private fun validateDoctorBelongsToOrganization(doctorId: UUID, organizationId: UUID) {
        val doctor = doctorRepository.findById(doctorId)
            .orElseThrow { IllegalArgumentException("Doctor not found with ID: $doctorId") }

        val userId = doctor.user.getIdSafely()
        if (!organizationUserRepository.existsByUserIdAndOrganizationId(userId, organizationId)) {
            throw IllegalArgumentException("Doctor with ID $doctorId does not belong to organization with ID $organizationId")
        }
    }

    /**
     * Create a new work schedule for a doctor.
     *
     * @param request the work schedule creation request (contains orgUserId, name, date range and patterns)
     * @return the created work schedule
     */
    @Transactional
    fun createWorkSchedule(request: CreateWorkScheduleRequest): WorkScheduleEntity {
        val orgUser = organizationUserRepository.findById(request.orgUserId)
            .orElseThrow { IllegalArgumentException("Organization User with ID ${request.orgUserId} does not exist") }

        val schedule = WorkScheduleEntity(
            orgUser = orgUser,
            name = request.name,
            startDate = request.startDate,
            endDate = request.endDate,
            workPatterns = mutableListOf(),
        )

        request.patterns.forEach { patternDto ->
            schedule.addWorkPattern(
                WorkPatternEntity(
                    schedule = null,
                    weekday = patternDto.weekday,
                    startTime = patternDto.startTime,
                    endTime = patternDto.endTime,
                )
            )
        }

        val savedSchedule = workScheduleRepository.save(schedule)

        return savedSchedule
    }

    /**
     * Get all work schedules for an organization user.
     *
     * @param orgUserId the ID of the organization user (doctor in organization)
     * @return a list of work schedules for the organization user
     */
    @Transactional(readOnly = true)
    fun getWorkSchedules(orgUserId: UUID): List<WorkScheduleEntity> {
        return workScheduleRepository.findByOrgUserId(orgUserId)
    }

    /**
     * Get a work schedule by ID.
     *
     * @param scheduleId the ID of the schedule
     * @return the work schedule or null if not found
     */
    @Transactional(readOnly = true)
    fun getWorkScheduleById(scheduleId: UUID): WorkScheduleEntity? {
        val schedule = workScheduleRepository.findById(scheduleId).orElse(null) ?: return null

        return schedule
    }

    /**
     * Update an existing work schedule.
     *
     * @param request the updated work schedule details
     * @return the updated work schedule or null if not found
     */
    @Transactional
    fun updateWorkSchedule(
        request: UpdateWorkScheduleRequest,
    ): WorkScheduleEntity? {
        val schedule = getWorkScheduleById(request.id) ?: return null

        // Update basic properties
        val updatedSchedule = WorkScheduleEntity(
            orgUser = schedule.orgUser,
            name = request.name,
            startDate = request.startDate,
            endDate = request.endDate,
        )
        updatedSchedule.id = schedule.id

        updatedSchedule.workPatterns.clear()
        request.patterns.forEach { patternDto ->
            updatedSchedule.addWorkPattern(
                WorkPatternEntity(
                    weekday = patternDto.weekday,
                    startTime = patternDto.startTime,
                    endTime = patternDto.endTime,
                )
            )
        }
        val savedSchedule = workScheduleRepository.save(updatedSchedule)

        return savedSchedule
    }

    /**
     * Delete a work schedule.
     *
     * @param scheduleId the ID of the schedule to delete
     * @param organizationId the ID of the organization
     * @return true if the schedule was deleted, false if it was not found
     */
    @Transactional
    fun deleteWorkSchedule(scheduleId: UUID, organizationId: UUID): Boolean {
        val schedule = getWorkScheduleById(scheduleId) ?: return false

        // Delete associated patterns first
        val patterns = workPatternRepository.findByScheduleId(scheduleId)
        patterns.forEach { workPatternRepository.delete(it) }

        // Delete the schedule
        workScheduleRepository.delete(schedule)

        return true
    }

    /**
     * Get active work schedules for a doctor on a specific date.
     *
     * @param orgUserId the ID of the organization user (doctor in organization)
     * @param date the date to check
     * @return a list of active work schedules for the doctor on the given date
     */
    @Transactional(readOnly = true)
    fun getActiveWorkSchedulesForDate(
        orgUserId: UUID,
        date: LocalDate
    ): List<WorkScheduleEntity> {
        return workScheduleRepository.findActiveSchedulesForDate(orgUserId, date, date.plusDays(1))
    }

    /**
     * Add a schedule exception for a doctor.
     *
     * @param request the exception creation request
     * @return the created schedule exception
     */
    @Transactional
    fun addException(
        request: CreateExceptionRequest
    ): ScheduleException {
        val orgUser = organizationUserRepository.findById(request.orgUserId)
            .orElseThrow { IllegalArgumentException("Organization not found with ID: ${request.orgUserId}") }

        val exception = ScheduleException(
            orgUser = orgUser,
            startDate = request.startDate,
            endDate = request.endDate,
            note = request.note
        )

        return scheduleExceptionRepository.save(exception)
    }

    // Overload kept for backward compatibility with tests
    @Transactional
    fun addException(
        orgUserId: UUID,
        startDate: LocalDate,
        endDate: LocalDate,
        note: String?
    ): ScheduleException {
        val request = CreateExceptionRequest(
            orgUserId = orgUserId,
            startDate = startDate,
            endDate = endDate,
            note = note
        )
        return addException(request)
    }

    /**
     * Get all schedule exceptions for a doctor.
     *
     * @param orgUserId the ID of the organization user (doctor in organization)
     * @return a list of schedule exceptions
     */
    @Transactional(readOnly = true)
    fun getExceptions(orgUserId: UUID): List<ScheduleException> {
        return scheduleExceptionRepository.findByOrgUserId(orgUserId)
    }

    @Transactional(readOnly = true)
    fun getAvailability(
        orgUserId: UUID,
        from: LocalDate,
        to: LocalDate
    ): List<WorkScheduleSlotDto> {
        // Validate inputs
        require(!to.isBefore(from)) { "'to' must not be before 'from'" }

        // 1) Retrieve schedules overlapping [from, to] (inclusive). Repository method expects exclusive end,
        //    so we pass to.plusDays(1) to include the 'to' date as well.
        val schedules = workScheduleRepository.findActiveSchedulesForDate(
            orgUserId, from, to.plusDays(1)
        )

        if (schedules.isEmpty()) {
            return emptyList()
        }

        // 2) Build schedule patterns per each day in [from, to] (inclusive)
        val dailySlots = mutableListOf<WorkScheduleSlotDto>()
        for (schedule in schedules) {
            // Clamp schedule dates to requested inclusive window and treat null endDate as 'to'
            val startDay = maxOf(schedule.startDate, from)
            val endDayInclusive = minOf(schedule.endDate ?: to, to)
            var d = startDay
            while (!d.isAfter(endDayInclusive)) {
                val weekday = d.dayOfWeek
                val dayPatterns = schedule.workPatterns.filter { it.weekday.name == weekday.name }
                if (dayPatterns.isNotEmpty()) {
                    for (p in dayPatterns) {
                        val dayStart: LocalDateTime = d.atTime(p.startTime)
                        val dayEnd: LocalDateTime = d.atTime(p.endTime)
                        dailySlots.add(WorkScheduleSlotDto(weekday = weekday, start = dayStart, end = dayEnd))
                    }
                }
                d = d.plusDays(1)
            }
        }

        if (dailySlots.isEmpty()) return emptyList()

        // 3) Using schedule exceptions remove overlapping days from schedule pattern list (inclusive bounds)
        val exceptions = scheduleExceptionRepository.findByOrgUserIdAndDateRange(
            orgUserId, from, to
        )
        val result = if (exceptions.isEmpty()) {
            dailySlots
        } else {
            dailySlots.filter { slot ->
                val date = slot.start.toLocalDate()
                // Keep slot only if it does NOT fall within any exception day (inclusive)
                exceptions.none { ex -> (date >= ex.startDate) && (date <= ex.endDate) }
            }
        }

        // 4) Sort result by start time then end time
        return result.sortedWith(compareBy({ it.start }, { it.end }))
    }
}
