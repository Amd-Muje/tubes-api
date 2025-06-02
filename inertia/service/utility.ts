interface RequestConfig extends RequestInit {
  token?: boolean
}

class ApiService {
  private baseUrl: string = 'http://localhost:3333/api'

  private getAuthToken(): string | null {
    return localStorage.getItem('access_token')
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
  async getCurrentUser() {
    const response = await this.fetchWithAuth('/me')
    return response.json()
  }
  async createCampaign(campaignData: {
    user_id?: string,
    title: string,
    description: string,
    target_amount: string,
    start_date: string,
    end_date: string,
    category: string,
    img_url: string
  }) {
    const response = await this.fetchWithAuth('/campaigns', {
      method: 'POST',
      body: JSON.stringify(campaignData),
    })
    return response.json()
  }

}

export const apiService = new ApiService()
