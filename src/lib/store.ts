// In-memory data store for newsletter signups and affiliate clicks
// In production, replace with a real database (Vercel KV, Supabase, etc.)

export interface NewsletterSignup {
  email: string;
  timestamp: string;
  source: string;
}

export interface AffiliateClick {
  id: string;
  product: string;
  timestamp: string;
  referrer: string;
  path: string;
}

class DataStore {
  private newsletters: NewsletterSignup[] = [];
  private clicks: AffiliateClick[] = [];

  addNewsletter(signup: NewsletterSignup) {
    // Prevent duplicate emails
    if (this.newsletters.some(s => s.email === signup.email)) {
      return false;
    }
    this.newsletters.push(signup);
    return true;
  }

  addClick(click: AffiliateClick) {
    this.clicks.push(click);
  }

  getNewsletters(): NewsletterSignup[] {
    return [...this.newsletters].reverse();
  }

  getClicks(): AffiliateClick[] {
    return [...this.clicks].reverse();
  }

  getStats() {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const clicksToday = this.clicks.filter(c => c.timestamp.startsWith(today)).length;
    const clicksWeek = this.clicks.filter(c => c.timestamp >= sevenDaysAgo).length;
    const signupsToday = this.newsletters.filter(s => s.timestamp.startsWith(today)).length;
    const signupsWeek = this.newsletters.filter(s => s.timestamp >= sevenDaysAgo).length;

    // Top products by clicks
    const productCounts: Record<string, number> = {};
    for (const click of this.clicks) {
      const key = click.product || click.id;
      productCounts[key] = (productCounts[key] || 0) + 1;
    }
    const topProducts = Object.entries(productCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([product, count]) => ({ product, count }));

    // Clicks by page
    const pageCounts: Record<string, number> = {};
    for (const click of this.clicks) {
      pageCounts[click.path] = (pageCounts[click.path] || 0) + 1;
    }
    const clicksByPage = Object.entries(pageCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([page, count]) => ({ page, count }));

    return {
      totalClicks: this.clicks.length,
      totalSignups: this.newsletters.length,
      clicksToday,
      clicksWeek,
      signupsToday,
      signupsWeek,
      topProducts,
      clicksByPage,
      recentClicks: this.clicks.slice(-20).reverse(),
      recentSignups: this.newsletters.slice(-20).reverse(),
    };
  }
}

// Singleton instance — persists for the lifetime of the server process
export const store = new DataStore();
