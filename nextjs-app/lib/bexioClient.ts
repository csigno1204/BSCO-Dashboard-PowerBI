// Bexio API Helper - Complete Implementation
// Based on official Bexio API documentation v3.0.0
// Base URL: https://api.bexio.com/2.0

import axios, { AxiosRequestConfig } from 'axios'

const BEXIO_API_BASE = 'https://api.bexio.com/2.0'
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // ms

interface BexioConfig {
  apiKey: string
  timeout?: number
}

interface PaginationParams {
  limit?: number
  offset?: number
  orderBy?: string
}

interface BexioResponse<T> {
  data: T[]
  paging?: {
    page: number
    page_size: number
    page_count: number
    item_count: number
  }
}

export class BexioAPIClient {
  private apiKey: string
  private timeout: number

  constructor(config: BexioConfig) {
    this.apiKey = config.apiKey
    this.timeout = config.timeout || 30000
  }

  /**
   * Make authenticated request to Bexio API
   */
  private async request<T>(
    endpoint: string,
    params: Record<string, any> = {},
    retries = 0
  ): Promise<T[]> {
    try {
      const config: AxiosRequestConfig = {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        params,
        timeout: this.timeout
      }

      const response = await axios.get<T[]>(`${BEXIO_API_BASE}${endpoint}`, config)
      return response.data || []
    } catch (error: any) {
      // Handle rate limiting (429) and server errors (5xx)
      if (error.response?.status === 429 || (error.response?.status >= 500 && error.response?.status < 600)) {
        if (retries < MAX_RETRIES) {
          const delay = RETRY_DELAY * Math.pow(2, retries)
          console.log(`Retrying after ${delay}ms (attempt ${retries + 1}/${MAX_RETRIES})`)
          await new Promise(resolve => setTimeout(resolve, delay))
          return this.request<T>(endpoint, params, retries + 1)
        }
      }

      // Handle authentication errors
      if (error.response?.status === 401) {
        throw new Error('Invalid API key or token expired')
      }

      // Handle not found
      if (error.response?.status === 404) {
        console.log(`Endpoint ${endpoint} not found or no data`)
        return []
      }

      throw error
    }
  }

  /**
   * Fetch all data with automatic pagination
   */
  private async fetchAllPages<T>(
    endpoint: string,
    limit = 500
  ): Promise<T[]> {
    let allData: T[] = []
    let offset = 0
    let hasMore = true

    while (hasMore) {
      const data = await this.request<T>(endpoint, { limit, offset })

      if (data.length === 0) {
        hasMore = false
      } else {
        allData = [...allData, ...data]
        offset += limit

        // Stop if we got less than the limit (last page)
        if (data.length < limit) {
          hasMore = false
        }
      }
    }

    return allData
  }

  // === CONTACTS ===
  async getContacts(params?: PaginationParams) {
    return this.fetchAllPages('/contact', params?.limit)
  }

  async getContact(id: number) {
    return this.request(`/contact/${id}`)
  }

  // === INVOICES (kb_invoice) ===
  async getInvoices(params?: PaginationParams) {
    return this.fetchAllPages('/kb_invoice', params?.limit)
  }

  async getInvoice(id: number) {
    return this.request(`/kb_invoice/${id}`)
  }

  // === OFFERS (kb_offer) ===
  async getOffers(params?: PaginationParams) {
    return this.fetchAllPages('/kb_offer', params?.limit)
  }

  async getOffer(id: number) {
    return this.request(`/kb_offer/${id}`)
  }

  // === ORDERS (kb_order) ===
  async getOrders(params?: PaginationParams) {
    return this.fetchAllPages('/kb_order', params?.limit)
  }

  async getOrder(id: number) {
    return this.request(`/kb_order/${id}`)
  }

  // === CREDIT NOTES (kb_credit_note) ===
  async getCreditNotes(params?: PaginationParams) {
    return this.fetchAllPages('/kb_credit_note', params?.limit)
  }

  async getCreditNote(id: number) {
    return this.request(`/kb_credit_note/${id}`)
  }

  // === PROJECTS (pr_project) ===
  async getProjects(params?: PaginationParams) {
    return this.fetchAllPages('/pr_project', params?.limit)
  }

  async getProject(id: number) {
    return this.request(`/pr_project/${id}`)
  }

  // === TIMESHEETS ===
  async getTimesheets(params?: PaginationParams) {
    return this.fetchAllPages('/timesheet', params?.limit)
  }

  async getTimesheet(id: number) {
    return this.request(`/timesheet/${id}`)
  }

  // === ARTICLES / PRODUCTS ===
  async getArticles(params?: PaginationParams) {
    return this.fetchAllPages('/article', params?.limit)
  }

  async getArticle(id: number) {
    return this.request(`/article/${id}`)
  }

  // === PAYMENTS (banking_payment) ===
  async getPayments(params?: PaginationParams) {
    return this.fetchAllPages('/banking_payment', params?.limit)
  }

  async getPayment(id: number) {
    return this.request(`/banking_payment/${id}`)
  }

  // === EXPENSES ===
  async getExpenses(params?: PaginationParams) {
    return this.fetchAllPages('/expense', params?.limit)
  }

  async getExpense(id: number) {
    return this.request(`/expense/${id}`)
  }

  // === NOTES / COMMUNICATIONS ===
  async getNotes(params?: PaginationParams) {
    return this.fetchAllPages('/note', params?.limit)
  }

  async getNote(id: number) {
    return this.request(`/note/${id}`)
  }

  // === TASKS ===
  async getTasks(params?: PaginationParams) {
    return this.fetchAllPages('/task', params?.limit)
  }

  async getTask(id: number) {
    return this.request(`/task/${id}`)
  }

  // === ACCOUNTS (chart of accounts) ===
  async getAccounts(params?: PaginationParams) {
    return this.fetchAllPages('/account', params?.limit)
  }

  async getAccount(id: number) {
    return this.request(`/account/${id}`)
  }

  // === CURRENCIES ===
  async getCurrencies() {
    return this.request('/currency')
  }

  // === COUNTRIES ===
  async getCountries() {
    return this.request('/country')
  }

  // === PAYMENT TYPES ===
  async getPaymentTypes() {
    return this.request('/payment_type')
  }

  // === UNITS ===
  async getUnits() {
    return this.request('/unit')
  }

  // === TAXES ===
  async getTaxes() {
    return this.request('/tax')
  }

  // === USERS ===
  async getUsers() {
    return this.request('/user')
  }

  // === COMPANY PROFILE ===
  async getCompanyProfile() {
    return this.request('/company_profile')
  }

  /**
   * Health check - verify API key is valid
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.request('/contact', { limit: 1 })
      return true
    } catch (error) {
      return false
    }
  }
}

// Export helper function
export async function createBexioClient(apiKey: string): Promise<BexioAPIClient> {
  const client = new BexioAPIClient({ apiKey })

  // Verify connection
  const isValid = await client.healthCheck()
  if (!isValid) {
    throw new Error('Invalid Bexio API key')
  }

  return client
}
