export interface Availabilities {
  availabilities: {
    date: string
    slots: string[]
    substitution: null
    appointment_request_slots: []
  }[]
  total: number
}

export interface AvailabilitiesParams {
  start_date: string
  visit_motive_ids: number
  agenda_ids: number
  practice_ids?: number
  telehealth: boolean
  limit: number
}
