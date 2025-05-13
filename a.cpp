//MD SHARIQUE HUSSAIN 2112015
#include <bits/stdc++.h>
#include <ext/pb_ds/tree_policy.hpp>
#include <ext/pb_ds/assoc_container.hpp>
using namespace __gnu_pbds;
using namespace std;
template<typename T> // pbds
using pbds = tree<T, null_type, less<T>, rb_tree_tag, tree_order_statistics_node_update>;
#define fbo find_by_order // kth largest element (0-based)
#define ook order_of_key // number of elements less than x
#define INF 1e18
#define pb push_back
#define pll pair <ll,ll>
#define ppb pop_back
#define mp make_pair
#define ff first
#define ss second
#define mod1 1000000007
#define mod2 998244353
#define PI 3.141592653589793238462
#define vch vector<char>
#define vll vector<ll>
#define vbb vector<bool>
#define vst vector<string>
#define mll map<ll,ll>
#define umll unordered_map<ll,ll>
#define mcl map<char,ll>
#define mlc map<ll,char>
#define msl map<string,ll>
#define si set <ll>
#define usi unordered_set <ll>
#define msi multiset <ll>
#define  pqsmall priority_queue <ll,vll,greater <ll> > 
#define  pqlarge priority_queue <ll> 
#define nl "\n"
#define yup {cout<<"YES"<<nl; return;}
#define nope {cout<<"NO"<<nl; return;}
typedef long long ll;
typedef unsigned long long ull;
typedef long double lld;
#define all(x) (x).begin(), (x).end()
#define ins insert
#define maxv(v) *max_element(all(v))
#define minv(v) *min_element(all(v))
//--------------------------------------------------------------//// nCr starts ////---------------------------------------------------------------
ll powerM(ll a, ll b, ll m){ll res = 1;while (b){if (b & 1){res = (res * a) % m;}a = (a * a) % m;b >>= 1;}return res;}
ll modInverse(ll a, ll m){return powerM(a, m - 2, m);}
ll nCrModPFermat(ll n, ll r, ll p){if (r == 0){return 1;}ll fact=1,r_fact=1;r=min(r,n-r);for (ll i = n; i>=(n-r+1); i--){fact=(fact*i)%p;}for(int i=r;i>=1;i--){r_fact=(r_fact*i)%p;}return (fact* modInverse(r_fact, p) ) % p;}
//--------------------------------------------------------------//// nCr ends ////-----------------------------------------------------------------
ll lower(lld x,vll &arr){ll n=arr.size();ll lo=0,hi=arr.size()-1,ans=n;while (lo<=hi){ll mid=(lo+hi)/2;if(x<=arr[mid]){ans=mid;hi=mid-1;}else{lo=mid+1;}}return ans;}
ll upper(lld x,vll &arr){ll lo=0,hi=arr.size()-1,ans=0;while (lo<=hi){ll mid=(lo+hi)/2;if(arr[mid]<=x){ans=mid+1;lo=mid+1;}else{hi=mid-1;}}return ans;}
#define FOR(i,a,b) for (auto i = a; i < b; i++)
ll string_mod_n(string &s,ll n){ll a=0,k=0,m=s.size();while(k<m){a=a*10 + (s[k]-'0');a=a%n;k++;}return a;}
lld sqt(lld x){lld lo=0,hi=x,ans;FOR(i,0,500){lld mid=(lo+hi)/2;if(mid*mid<=x){ans=mid;lo=mid;}else{hi=mid;}}return ans;}
void fact_array(ll x,vll &v1){for (ll i = 1; i * i <= x; i++){if (x % i == 0){v1.pb(i);if (i * i != x){v1.pb(x / i);}}}sort(all(v1));}
bool cmp(pair<ll,ll> a,pair<ll,ll> b){if (a.ff!=b.ff){return a.ff>b.ff;}else{return a.ss<b.ss;}}
ll gcd (ll a, ll b){return b == 0 ? a : gcd(b, a % b);}
ll power(ll a,ll n){ll ct=0;if (!(a%n)){while (a%n==0){a/=n;ct++;}}return ct;}
ll computeXOR (ll n){if (n % 4 == 0)return n;if (n % 4 == 1)return 1;if (n % 4 == 2)return n + 1;return 0;}
void seive1(bool vb[],ll n) {vb[0]=vb[1]=1;for (ll i=2;(i*i)<n;i++){if (vb[i]==0){for  (ll j = i*i; j < n; j+=i){vb[j]=1;}}}}
ll celi(ll a,ll b){return (a+b-1)/b;}
ll modulas(ll i,ll m){return ((i%m)+m)%m;}
ll flor(ll a,ll b){return (a)/b;}
ll moduler_expo(ll a,ll n,ll m){ll x=1,pow=a%m;while (n){if (n&1){x=(x*pow)%m;}pow=(pow*pow)%m;n=n>>1;}return x;}
void fact(ll n,vector<pll> &vp1){for(ll i=2;i*i<=n;i++){if(n%i==0){ll ct=0;while (n%i==0){ct++;n/=i;}vp1.pb(mp(i,ct));}}if(n>1)vp1.pb(mp(n,1));}
ll multi_inv(ll r1,ll r2){ll q,r,t1=0,t2=1,t,m=r1;while (r2 > 0){q=r1/r2;r=r1%r2;t=1-(q*t2);r1=r2;r2=r;t1=t2;t2=t;}if (t1<0){ll a=abs(t1/m);a++;a=a*m;t1=a+t1;}return t1;}
#define rsort(a) sort(a, a + n, greater ll>())
#define rvsort(a) sort(all(a), greater ll>())
#define rFOR(i,a,b) for (auto i = a; i >= b; i--)
#define read(a,n) for (ll i=0;i<n;i++){cin >> a[i];}
class DisjointSet {public: vll rank, parent, size; DisjointSet(ll n) {rank.resize(n+1, 0); parent.resize(n+1);size.resize(n+1); for (ll i = 0;i<=n;i++) {parent[i] = i; size[i] = 1; }}
ll findpar(ll node) {if(node == parent[node])return node; return parent[node] = findpar(parent[node]); }
void unionByRank(ll u, ll v) {ll ulp_u = findpar(u); ll ulp_v = findpar(v); if(ulp_u == ulp_v) return; if(rank[ulp_u] < rank[ulp_v]) {parent[ulp_u] = ulp_v;}else if(rank[ulp_v] < rank[ulp_u]) {parent[ulp_v] = ulp_u; }else {parent[ulp_v] = ulp_u; rank[ulp_u]++; }}
void unionBySize (ll u, ll v) {ll ulp_u = findpar(u); ll ulp_v = findpar(v); if(ulp_u == ulp_v) return; if(size[ulp_u] < size[ulp_v]) {parent[ulp_u] = ulp_v; size[ulp_v] += size[ulp_u]; }else {parent[ulp_v] = ulp_u;size[ulp_u] += size[ulp_v]; }}};
const ll large_number=1e7;
void sol()
{
    
}
int32_t main()
{
    #ifndef ONLINE_JUDGE
    freopen("input.txt","r",stdin);
    freopen("output.txt","w", stdout);
    #endif
    ios_base::sync_with_stdio(0);
    cin.tie(0);
    bool flag=1;
    int t;
    t=1;
    if(flag==1){cin>>t;}
    while(t--)
    {
        sol();
    }
    return 0;
}