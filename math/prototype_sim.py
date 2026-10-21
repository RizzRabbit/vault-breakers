import random,sys
N=5
SYM=['H1','H2','H3','H4','L1','L2','L3','L4','W','S']
W_BASE={'H1':3,'H2':4,'H3':5,'H4':6,'L1':14,'L2':15,'L3':16,'L4':17,'W':2.5,'S':1.05}
W_FS=dict(W_BASE); W_FS['S']=0.8; W_FS['W']=5.3
# pay per cluster size buckets 5,6,7,8,9-10,11-12,13-15,16+
PAY={'H1':[1.5,2,3,5,10,25,60,150],'H2':[1,1.5,2.5,4,8,18,45,100],'H3':[.8,1.2,2,3,6,14,35,80],'H4':[.6,1,1.5,2.5,5,10,25,60],
 'L1':[.4,.5,.8,1.2,2,5,12,30],'L2':[.3,.4,.6,1,1.6,4,10,25],'L3':[.25,.35,.5,.8,1.3,3,8,20],'L4':[.2,.3,.4,.6,1,2.5,6,15]}
def b(n): return 0 if n<9 else 4 if n<=10 else 5 if n<=12 else 6 if n<=15 else 7 if n>=16 else 0
def bucket(n): return n-5 if n<9 else b(n)
CAP=10000; MMAX=128; SCALE=float(sys.argv[2]) if len(sys.argv)>2 else 1.0
def draw(w):
    k=list(w); v=list(w.values()); return random.choices(k,v)[0]
def clusters(g):
    res=[]
    for s in PAY:
        seen=set()
        for i in range(N):
            for j in range(N):
                if (i,j) in seen or g[i][j] not in (s,'W'): continue
                st=[(i,j)];comp=[];seen.add((i,j))
                while st:
                    a,c=st.pop();comp.append((a,c))
                    for d,e in((a+1,c),(a-1,c),(a,c+1),(a,c-1)):
                        if 0<=d<N and 0<=e<N and (d,e) not in seen and g[d][e] in (s,'W'):
                            seen.add((d,e));st.append((d,e))
                if len(comp)>=5 and any(g[x][y]==s for x,y in comp): res.append((s,comp))
    return res
def spin(w,mult,sc_=None):
    k=FSS if w is W_FS else SCALE
    g=[[draw(w) for j in range(N)] for i in range(N)]
    sc=sum(r.count('S') for r in g); win=0
    while True:
        cl=clusters(g)
        if not cl: break
        rm=set()
        for s,comp in cl:
            m=sum(mult[x][y] for x,y in comp if mult[x][y]>0) or 1
            win+=PAY[s][bucket(len(comp))]*k*m; rm|=set(comp)
        for x,y in rm:
            mult[x][y]=1 if mult[x][y]==0 else min(MMAX,max(2,mult[x][y]*2))
        for j in range(N):
            col=[g[i][j] for i in range(N) if (i,j) not in rm]
            new=[draw(w) for _ in range(N-len(col))]
            sc+=new.count('S'); col=new+col
            for i in range(N): g[i][j]=col[i]
    return win,sc
def fs(n):
    mult=[[0]*N for _ in range(N)];tot=0
    while n>0:
        n-=1;w,sc=spin(W_FS,mult);tot+=w
        if sc>=3:n+=5
        if tot>=CAP: return CAP
    return min(tot,CAP)
def mult0(): return [[0]*N for _ in range(N)]
FSS=float(sys.argv[4]) if len(sys.argv)>4 else SCALE
mode=sys.argv[1]; R=int(sys.argv[3]) if len(sys.argv)>3 else 100000
tot=hits=trig=0;mx=0
for _ in range(R):
    if mode=='base':
        w,sc=spin(W_BASE,mult0())
        if sc>=3: trig+=1; w+=fs({3:10,4:12}.get(sc,15))
        w=min(w,CAP)
    else: w=fs(10)
    tot+=w;hits+=w>0;mx=max(mx,w)
cost=1 if mode=='base' else 100
print(mode,'RTP',round(tot/R/cost*100,2),'hit 1 in',round(R/max(hits,1),2),'fs 1 in',round(R/max(trig,1)),'max',round(mx,1))
