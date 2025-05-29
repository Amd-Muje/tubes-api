interface RequestConfig extends RequestInit {
  token?: boolean
}

class ApiService {
  private baseUrl: string = 'http://localhost:3333/api'

  private getAuthToken(): string | null {
    return localStorage.getItem('authToken')
  }

  private async fetchWithAuth(endpoint: string, options: RequestConfig = {}): Promise<Response> {
    const token = this.getAuthToken()

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: token }),
      ...options.headers,
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Something went wrong')
    }

    return response
  }

  // // Campaigns
  // async getCampaigns() {
  //   const response = await this.fetchWithAuth('/campaigns')
  //   return response.json()
  // }

  // async getCampaignById(id: string) {
  //   const response = await this.fetchWithAuth(`/campaign/${id}`)
  //   return response.json()
  // }
  async getCurrentUser() {
    const response = await this.fetchWithAuth('/me')
    return response.json()
  }
}

export const apiService = new ApiService()
