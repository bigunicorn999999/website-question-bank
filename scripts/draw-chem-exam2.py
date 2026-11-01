from pathlib import Path
from html import escape
import math
OUT=Path(__file__).resolve().parents[1]/'figures/chem-exam2';OUT.mkdir(parents=True,exist_ok=True)
INK='#183d44';BLUE='#287b94';GOLD='#ae7018';GREEN='#4d8064';BG='#f6f9f8'
class SVG:
 def __init__(self,w,h,title):self.w=w;self.h=h;self.a=[f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" role="img" aria-label="{escape(title)}"><rect width="100%" height="100%" rx="16" fill="{BG}"/>'];self.text(24,30,title,18,bold=True,anchor='start')
 def text(self,x,y,s,size=17,color=INK,bold=False,anchor='middle'):
  self.a.append(f'<text x="{x}" y="{y}" text-anchor="{anchor}" font-family="Arial, Segoe UI, sans-serif" font-size="{size}" fill="{color}"'+(' font-weight="bold"' if bold else '')+'>'+escape(str(s))+'</text>')
 def line(self,x,y,X,Y,color=INK,width=2,dash=False):self.a.append(f'<line x1="{x}" y1="{y}" x2="{X}" y2="{Y}" stroke="{color}" stroke-width="{width}"'+(' stroke-dasharray="6 5"' if dash else '')+'/>')
 def dot(self,x,y,r=2.2,color=INK):self.a.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{color}"/>')
 def rect(self,x,y,w,h):self.a.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="white" stroke="#cbdcde"/>')
 def bond(self,x,y,X,Y,n=1):
  d=math.hypot(X-x,Y-y);ux=(X-x)/d;uy=(Y-y)/d
  for j in range(n):
   off=(j-(n-1)/2)*5;self.line(x+ux*15-uy*off,y+uy*15+ux*off,X-ux*15-uy*off,Y-uy*15+ux*off)
 def lp(self,x,y,where):
  # One pair on each requested side; avoid the bonding direction.
  for side in where:
   dx,dy={'t':(0,-19),'b':(0,17),'l':(-21,0),'r':(21,0)}[side]
   if side in 'tb':self.dot(x+dx-4,y+dy);self.dot(x+dx+4,y+dy)
   else:self.dot(x+dx,y+dy-4);self.dot(x+dx,y+dy+4)
 def atom(self,x,y,s):self.text(x,y+6,s,22,bold=True)
 def arrow(self,x,y,X,Y,label=None):
  self.line(x,y,X,Y,BLUE,3);a=math.atan2(Y-y,X-x);p=[(X,Y),(X-10*math.cos(a-.45),Y-10*math.sin(a-.45)),(X-10*math.cos(a+.45),Y-10*math.sin(a+.45))];self.a.append('<polygon points="'+' '.join(f'{a},{b}' for a,b in p)+f'" fill="{BLUE}"/>')
  if label:self.text(x-18,(y+Y)/2,label,18,BLUE,True)
 def save(self,name): (OUT/(name+'.svg')).write_text(''.join(self.a)+'</svg>',encoding='utf-8')

s=SVG(740,430,'Hydrogen transitions - schematic levels')
ys={1:360,2:240,3:160,4:85}
for n,y in ys.items():s.line(100,y,635,y,'#b3c7cd',2);s.text(665,y+6,'n = '+str(n),17)
for x,ni,nf,label in [(170,1,3,'A'),(310,3,1,'B'),(450,3,2,'C'),(565,2,4,'D')]:s.arrow(x,ys[ni]-2,x,ys[nf]+(8 if nf>ni else -8),label)
s.text(370,407,'Use the level labels and energy formula; spacing is not to scale.',14)
s.save('hydrogen')

s=SVG(760,245,'Three proposed p⁴ arrangements')
for i,(label,occ) in enumerate([('A',['↑↓','↑','↑']),('B',['↑↓','↑↓','']),('C',['↑↑','↑','↑'])]):
 x=15+250*i;s.rect(x,60,230,165);s.text(x+115,91,label,20,bold=True)
 for j,t in enumerate(occ):
  xx=x+22+j*65;s.line(xx,167,xx+50,167,INK,2);s.text(xx+25,155,t,28)
s.save('orbital-p4')

s=SVG(740,515,'COCl₂: choose the best Lewis structure')
for i,label in enumerate('ABCD'):
 x=15+(i%2)*365;y=55+(i//2)*225;s.rect(x,y,350,215);s.text(x+28,y+28,label,20,bold=True)
 C=(x+175,y+108);O=(x+175,y+49);L=(x+86,y+164);R=(x+264,y+164)
 for p,txt in [(C,'C'),(O,'O'),(L,'Cl'),(R,'Cl')]:s.atom(*p,txt)
 s.bond(*C,*O,1 if label=='C' else 2);s.bond(*C,*L,2 if label=='B' else 1);s.bond(*C,*R)
 s.lp(*O,'tlr' if label in 'CD' else 'lr');s.lp(*L,'lb' if label=='B' else 'ltb');s.lp(*R,'rtb')
s.text(370,506,'All lone pairs are shown. A dot pair represents two electrons.',13)
s.save('lewis-cocl2')

s=SVG(700,200,'Read the electrons, then infer the charge')
for x,t in [(150,'N'),(350,'C'),(550,'O')]:s.atom(x,112,t)
s.bond(150,112,350,112,2);s.bond(350,112,550,112,2);s.lp(150,112,'tl');s.lp(550,112,'tr')
s.text(350,181,'Two lone pairs on N; two on O; none on C.',15);s.save('nco-double')

s=SVG(600,300,'Infer the formula from the Lewis drawing')
C=(300,155);Os=[(300,72),(160,230),(440,230)]
s.atom(*C,'C')
for i,p in enumerate(Os):s.bond(*C,*p,2 if i==0 else 1);s.atom(*p,'O');s.lp(*p,'lr' if i==0 else ('ltb' if i==1 else 'rtb'))
s.save('carbonate')
s=SVG(700,220,'One ozone contributor')
for x,y in [(140,130),(350,100),(560,130)]:s.atom(x,y,'O')
s.bond(140,130,350,100,2);s.bond(350,100,560,130);s.lp(140,130,'tl');s.lp(350,100,'t');s.lp(560,130,'trb');s.save('ozone')

s=SVG(780,230,'A labeled molecular structure')
centers=[(70,'CH₂'),(195,'CH'),(320,'C'),(445,'CH₂'),(570,'C'),(690,'N')]
for i,(x,t) in enumerate(centers):s.atom(x,125,t)
for i,n in enumerate([2,1,1,1,3]):
 x=centers[i][0];X=centers[i+1][0];margin=30 if i in [0,3] else 18
 # Condensed CH labels require a little more clearance than atom-only labels.
 for k in range(n):s.line(x+margin,125+(k-(n-1)/2)*5,X-30 if centers[i+1][1].startswith('CH') else X-18,125+(k-(n-1)/2)*5)
s.atom(320,58,'O');s.bond(320,125,320,58,2);s.lp(320,58,'lr');s.lp(690,125,'r')
for i,(x,t) in enumerate(centers[:-1]):s.text(x,172,'C'+str(i+1),16,BLUE,True)
s.text(390,211,'Connectivity: CH₂=CH–C(=O)–CH₂–C≡N',15);s.save('carbon-chain')

s=SVG(800,315,'Same bonds; different spatial cancellation')
for i,label in enumerate(['cis','trans']):
 x=20+i*395;s.rect(x,58,375,238);s.text(x+187,89,label,19,bold=True)
 c1=(x+130,175);c2=(x+245,175);s.atom(*c1,'C');s.atom(*c2,'C');s.bond(*c1,*c2,2)
 terms=[(x+65,120,'Cl'),(x+65,236,'H'),(x+310,120,'Cl' if label=='cis' else 'H'),(x+310,236,'H' if label=='cis' else 'Cl')]
 for j,(xx,yy,t) in enumerate(terms):s.bond(*(c1 if j<2 else c2),xx,yy);s.atom(xx,yy,t)
s.save('cis-trans')

def ring(s,cx,cy,R=75):
 pts=[(cx+R*math.cos(i*math.pi/3),cy+R*math.sin(i*math.pi/3)) for i in range(6)]
 for i in range(6):
  x,y=pts[i];X,Y=pts[(i+1)%6];s.line(x,y,X,Y)
  if i%2==0:s.line(cx+(x-cx)*.85,cy+(y-cy)*.85,cx+(X-cx)*.85,cy+(Y-cy)*.85)
  if i!=0:
   hx=cx+(x-cx)*(1+30/R);hy=cy+(y-cy)*(1+30/R);s.line(x,y,cx+(x-cx)*(1+17/R),cy+(y-cy)*(1+17/R));s.text(hx,hy+5,'H',17)
 return pts[0]
s=SVG(650,330,'Benzonitrile - all five ring hydrogens shown')
x,y=ring(s,180,175,80);s.line(x,y,335,175);s.atom(350,175,'C');s.bond(350,175,470,175,3);s.atom(470,175,'N');s.lp(470,175,'r');s.save('benzonitrile')
s=SVG(900,335,'Aromatic oxygen-containing compounds')
for i,label in enumerate(['A: phenol','B: anisole']):
 x=i*450;s.rect(x+10,58,430,260);s.text(x+225,88,label,18,bold=True);rx,ry=ring(s,x+145,193,66)
 s.line(rx,ry,x+278,193);s.atom(x+295,193,'O');s.lp(x+295,193,'tb');s.line(x+310,193,x+358,193);s.atom(x+382,193,'H' if i==0 else 'CH₃')
s.save('aromatic-pair')
s=SVG(700,330,'Styrene - include every C–H bond in the count')
x,y=ring(s,180,175,80);s.line(x,y,330,175);s.atom(350,175,'CH');s.line(378,172,470,172);s.line(378,178,470,178);s.atom(503,175,'CH₂');s.save('styrene')

s=SVG(760,470,'Vapor pressure versus temperature')
xx=lambda T:80+(T-280)*8
yy=lambda P:405-P/1200*330
s.arrow(80,405,700,405);s.arrow(80,405,80,55)
for T in [280,300,320,340,355]:s.line(xx(T),405,xx(T),412);s.text(xx(T),434,str(T),15)
for P in [0,400,760,1200]:s.line(74,yy(P),80,yy(P));s.text(67,yy(P)+5,str(P),14,anchor='end')
s.line(80,yy(760),690,yy(760),GOLD,1.8,True)
for Tb,color,label in [(320,BLUE,'A'),(340,GREEN,'B')]:
 points=[]
 for i in range(151):
  T=280+i*.5;P=760*math.exp(-30000/8.314*(1/T-1/Tb))
  if P<=1180:points.append((xx(T),yy(P)))
 for p1,p2 in zip(points,points[1:]):s.line(*p1,*p2,color,3)
 ex,ey=points[-1];s.text(ex+15,ey+5,label,20,color,True)
 s.line(xx(Tb),yy(760),xx(Tb),405,'#8ba4aa',1.4,True);s.dot(xx(Tb),yy(760),4,color)
s.text(410,462,'Temperature (K)',16);s.text(195,63,'P (torr)',16);s.text(665,yy(760)-12,'760 torr',14,GOLD);s.save('vapor-curves')

s=SVG(760,285,'Carbon: promotion and an sp² orbital construction')
def orbital(x,y,occ):s.line(x,y,x+36,y);s.text(x+18,y-7,occ,22)
for x,title in [(30,'Ground atom'),(270,'Promoted model')]:
 s.text(x+70,72,title,16,bold=True)
 for j,o in enumerate(['↑','↑',''] if x==30 else ['↑','↑','↑']):orbital(x+j*48,130,o)
 orbital(x+48,210,'↑↓' if x==30 else '↑');s.text(x+180,133,'2p',14);s.text(x+113,213,'2s',14)
s.arrow(230,155,263,155);s.arrow(471,155,503,155)
for j in range(3):orbital(515+j*49,175,'↑')
orbital(695,130,'↑');s.text(581,210,'three sp² hybrids',14);s.text(714,105,'p',15,BLUE)
s.text(380,263,'Four valence electrons throughout; mixing occurs within one atom.',14);s.save('sp2-mixing')

s=SVG(760,475,'CO₂ phase diagram - schematic, not to scale')
s.arrow(90,395,700,395);s.arrow(90,395,90,70)
tr=(320,290);cr=(540,155)
# Boundaries are only schematic; labeled coordinates supply the numerical data.
s.a.append(f'<path d="M90 395 Q220 365 320 290 L365 70 M320 290 Q450 267 540 155" fill="none" stroke="{BLUE}" stroke-width="3"/>')
s.line(90,290,320,290,'#9cb3b9',1.2,True);s.line(320,290,320,395,'#9cb3b9',1.2,True);s.line(90,155,540,155,'#9cb3b9',1.2,True);s.line(540,155,540,395,'#9cb3b9',1.2,True)
s.dot(*tr,5);s.dot(*cr,5);s.text(205,210,'SOLID',20);s.text(420,160,'LIQUID',20);s.text(550,347,'GAS',20);s.text(630,95,'Supercritical',17)
s.text(420,313,'Triple point',15);s.text(608,180,'Critical point',15);s.text(320,425,'−56.6°C',15);s.text(540,425,'31.0°C',15);s.text(70,295,'5.11',14,anchor='end');s.text(70,160,'73.0',14,anchor='end');s.text(395,460,'Temperature (°C)',16);s.text(150,62,'Pressure (atm)',16);s.save('co2-phase')
print('Generated',len(list(OUT.glob('*.svg'))),'original SVG figures.')
