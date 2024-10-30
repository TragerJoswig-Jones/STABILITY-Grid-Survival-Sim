/**
 * Load curve: ranges from 0.1 to 0.9 in one minute intervals for a period of a day.
 * Loosely based on the average residential load in March of 2020.
 */

export const LOAD_CURVE = [0.454369332856439, 0.446274385623698, 0.438298617890323, 0.430441093492254, 0.422700880792615, 0.415077052668956, 0.407568686500502, 0.400174864155425, 0.392894671978127, 0.385727200776544, 0.378671545809461, 0.37172680677385, 0.364892087792217, 0.358166497399972, 0.351549148532807, 0.345039158514101, 0.338635649042335, 0.332337746178516, 0.326144580333636, 0.32005528625613, 0.314069003019357, 0.308184874009098, 0.302402046911068, 0.296719673698449, 0.291136910619428, 0.28565291818477, 0.280266861155385, 0.274977908529929, 0.269785233532413, 0.264688013599829, 0.259685430369796, 0.254776669668217, 0.249960921496957, 0.245237380021529, 0.240605243558811, 0.236063714564766, 0.231611999622181, 0.227249309428428, 0.222974858783234, 0.218787866576474, 0.214687555775973, 0.210673153415334, 0.206743890581766, 0.202899002403951, 0.199137728039907, 0.195459310664878, 0.191862997459234, 0.188348039596397, 0.184913692230771, 0.181559214485698, 0.178283869441424, 0.175086924123087, 0.171967649488713, 0.168925320417238, 0.16595921569654, 0.163068618011488, 0.160252813932007, 0.157511093901166, 0.154842752223269, 0.152247087051975, 0.149723400378426, 0.147270998019401, 0.144889189605468, 0.142577288569174, 0.140334612133239, 0.138160481298765, 0.136054220833467, 0.13401515925992, 0.132042628843815, 0.130135965582243, 0.128294509191984, 0.126517603097819, 0.124804594420853, 0.123154833966865, 0.121567676214659, 0.120042479304442, 0.118578605026218, 0.117175418808193, 0.115832289705195, 0.114548590387125, 0.1133236971274, 0.112156989791437, 0.111047851825135, 0.109995670243383, 0.108999835618582, 0.108059742069179, 0.107174787248227, 0.106344372331949, 0.105567902008329, 0.104844784465713, 0.104174431381428, 0.103556257910417, 0.102989682673892, 0.102474127748001, 0.102009018652511, 0.10159378433951, 0.101227857182123, 0.100910672963246, 0.100641670864292, 0.100420293453959, 0.100245986677013, 0.100118199843082, 0.100036385615472, 0.1, 0.100008502333837, 0.100061355274373, 0.100158024788094, 0.100297980139483, 0.100480693879924, 0.100705641836636, 0.100972303101617, 0.1012801600206, 0.101628698182034, 0.102017406406077, 0.102445776733603, 0.102913304415229, 0.103419487900358, 0.103963828826234, 0.104545832007022, 0.10516500542289, 0.105820860209126, 0.106512910645253, 0.107240674144173, 0.108003671241322, 0.10880142558384, 0.109633463919762, 0.110499316087221, 0.111398515003668, 0.112330596655113, 0.113295100085372, 0.114291567385343, 0.115319543682286, 0.116378577129131, 0.117468218893791, 0.1185880231485, 0.119737547059164, 0.120916350774725, 0.122123997416548, 0.12336005306782, 0.124624086762961, 0.125915670477066, 0.127234379115345, 0.128579790502589, 0.129951485372657, 0.131349047357966, 0.132772062979005, 0.134220121633876, 0.13569281558782, 0.137189739962801, 0.138710492727065, 0.140254674684754, 0.141821889465495, 0.143411743514053, 0.14502384607995, 0.146657809207143, 0.148313247723693, 0.149989779231453, 0.151687024095788, 0.153404605435286, 0.155142149111516, 0.156899283718765, 0.158675640573834, 0.160470853705808, 0.162284559845877, 0.164116398417152, 0.165966011524501, 0.167833043944414, 0.16971714311486, 0.171617959125191, 0.173535144706029, 0.175468355219203, 0.177417248647669, 0.179381485585477, 0.181360729227734, 0.183354645360579, 0.18536290235121, 0.187385171137868, 0.189421125219906, 0.191470440647808, 0.193532796013282, 0.195607872439318, 0.197695353570307, 0.199794925562153, 0.201906277072387, 0.204029099250343, 0.206163085727294, 0.208307932606656, 0.210463338454164, 0.212629004288108, 0.214804633569534, 0.216989932192517, 0.219184608474408, 0.221388373146104, 0.22360093934237, 0.225822022592112, 0.228051340808741, 0.230288614280484, 0.232533565660772, 0.234785919958586, 0.237045404528875, 0.239311749062955, 0.241584685578918, 0.243863948412102, 0.246149274205515, 0.248440401900343, 0.250737072726404, 0.253039030192685, 0.255346020077837, 0.257657790420737, 0.259974091511028, 0.262294675879685, 0.264619298289623, 0.266947715726274, 0.269279687388233, 0.271614974677866, 0.273953341191989, 0.276294552712511, 0.278638377197144, 0.280984584770085, 0.283332947712732, 0.285683240454439, 0.288035239563233, 0.290388723736615, 0.29274347379231, 0.295099272659093, 0.297455905367576, 0.299813159041067, 0.3021708228864, 0.304528688184794, 0.306886548282755, 0.309244198582941, 0.311601436535109, 0.313958061627007, 0.316313875375354, 0.318668681316771, 0.321022284998778, 0.323374493970783, 0.325725117775082, 0.328073967937903, 0.330420857960424, 0.332765603309863, 0.335108021410518, 0.337447931634891, 0.339785155294766, 0.342119515632358, 0.34445083781144, 0.346778948908491, 0.349103677903891, 0.351424855673084, 0.353742314977811, 0.356055890457298, 0.358365418619529, 0.360670737832466, 0.362971688315348, 0.365268112129962, 0.367559853171939, 0.369846757162096, 0.372128671637739, 0.374405445944053, 0.376676931225431, 0.378942980416887, 0.381203448235436, 0.383458191171524, 0.385707067480461, 0.387949937173852, 0.390186662011088, 0.392417105490801, 0.394641132842389, 0.396858611017502, 0.399069408681599, 0.40127339620547, 0.403470445656817, 0.405660430791832, 0.407843227046772, 0.410018711529598, 0.412186763011581, 0.414347261918964, 0.416500090324603, 0.418645131939667, 0.420782272105302, 0.422911397784369, 0.425032397553155, 0.427145161593107, 0.42924958168261, 0.43134555118874, 0.433432965059074, 0.435511719813479, 0.437581713535952, 0.439642845866439, 0.441695017992712, 0.443738132642228, 0.445772094074018, 0.447796808070596, 0.449812181929868, 0.451818124457092, 0.453814545956803, 0.455801358224804, 0.457778474540138, 0.4597458096571, 0.461703279797249, 0.46365080264144, 0.465588297321885, 0.467515684414206, 0.469432885929535, 0.471339825306593, 0.473236427403828, 0.475122618491522, 0.476998326243967, 0.478863479731611, 0.480718009413235, 0.482561847128172, 0.484394926088493, 0.486217180871264, 0.488028547410762, 0.489828962990767, 0.491618366236819, 0.493396697108521, 0.495163896891855, 0.49691990819149, 0.498664674923152, 0.50039814230596, 0.50212025685482, 0.503830966372799, 0.505530219943559, 0.50721796792375, 0.508894161935476, 0.510558754858746, 0.512211700823936, 0.513852955204299, 0.515482474608449, 0.517100216872902, 0.518706141054604, 0.520300207423488, 0.521882377455047, 0.523452613822917, 0.525010880391492, 0.526557142208524, 0.528091365497782, 0.529613517651682, 0.531123567223977, 0.532621483922425, 0.534107238601499, 0.535580803255103, 0.537042151009305, 0.538491256115087, 0.539928093941111, 0.541352640966503, 0.542764874773649, 0.544164774041014, 0.545552318535965, 0.546927489107636, 0.548290267679767, 0.54964063724361, 0.550978581850806, 0.552304086606302, 0.553617137661292, 0.554917722206142, 0.55620582846337, 0.557481445680611, 0.55874456412362, 0.55999517506927, 0.561233270798595, 0.562458844589819, 0.563671890711425, 0.564872404415217, 0.566060381929428, 0.567235820451817, 0.568398718142791, 0.569549074118561, 0.570686888444275, 0.57181216212721, 0.572924897109959, 0.57402509626362, 0.575112763381042, 0.576187903170042, 0.577250521246671, 0.578300624128479, 0.57933821922781, 0.580363314845088, 0.581375920162157, 0.582376045235603, 0.583363700990106, 0.584338899211818, 0.585301652541731, 0.586251974469096, 0.587189879324823, 0.588115382274934, 0.589028499313982, 0.58992924725855, 0.590817643740715, 0.591693707201539, 0.592557456884609, 0.593408912829534, 0.594248095865523, 0.595075027604934, 0.595889730436848, 0.596692227520667, 0.597482542779747, 0.598260700894997, 0.59902672729853, 0.599780648167347, 0.600522490416978, 0.60125228169521, 0.601970050375766, 0.602675825552053, 0.603369637030895, 0.604051515326292, 0.604721491653198, 0.605379597921298, 0.606025866728842, 0.606660331356443, 0.607283025760922, 0.60789398456918, 0.60849324307205, 0.609080837218196, 0.609656803608012, 0.61022117948755, 0.610774002742454, 0.611315311891912, 0.61184514608262, 0.612363545082792, 0.612870549276124, 0.613366199655853, 0.613850537818756, 0.614323605959231, 0.614785446863341, 0.615236103902914, 0.615675621029632, 0.616104042769155, 0.616521414215244, 0.616927781023928, 0.617323189407641, 0.617707686129429, 0.618081318497135, 0.618444134357616, 0.618796182090965, 0.619137510604772, 0.619468169328373, 0.61978820820714, 0.620097677696766, 0.620396628757585, 0.620685112848886, 0.620963181923275, 0.621230888421025, 0.621488285264454, 0.621735425852307, 0.621972364054194, 0.622199154204978, 0.622415851099243, 0.622622509985745, 0.622819186561875, 0.623005936968175, 0.623182817782804, 0.623349886016108, 0.623507199105119, 0.623654814908139, 0.623792791699292, 0.623921188163116, 0.624040063389177, 0.624149476866682, 0.624249488479116, 0.624340158498885, 0.624421547582008, 0.624493716762781, 0.624556727448495, 0.624610641414137, 0.624655520797138, 0.624691428092111, 0.624718426145642, 0.624736578151035, 0.62474594764315, 0.62474659849318, 0.624738594903526, 0.624722001402617, 0.624696882839765, 0.624663304380069, 0.624621331499309, 0.624571029978853, 0.624512465900568, 0.624445705641809, 0.624370815870339, 0.624287863539325, 0.624196915882344, 0.624098040408361, 0.623991304896796, 0.623876777392528, 0.623754526200981, 0.623624619883208, 0.623487127250939, 0.623342117361737, 0.623189659514094, 0.623029823242577, 0.622862678313002, 0.622688294717578, 0.622506742670127, 0.622318092601261, 0.622122415153624, 0.621919781177128, 0.621710261724199, 0.621493928045058, 0.621270851582995, 0.621041103969679, 0.620804757020495, 0.620561882729849, 0.62031255326653, 0.620056840969107, 0.619794818341266, 0.619526558047248, 0.619252132907246, 0.618971615892858, 0.618685080122501, 0.618392598856925, 0.618094245494662, 0.617790093567528, 0.617480216736146, 0.617164688785484, 0.616843583620378, 0.616516975261114, 0.616184937839009, 0.615847545592, 0.615504872860254, 0.615156994081803, 0.614803983788204, 0.614445916600149, 0.614082867223206, 0.613714910443467, 0.61334212112328, 0.61296457419698, 0.612582344666597, 0.612195507597665, 0.611804138114941, 0.611408311398259, 0.611008102678284, 0.61060358723236, 0.610194840380346, 0.609781937480479, 0.609364953925232, 0.608943965137218, 0.608519046565089, 0.608090273679433, 0.607657721968786, 0.607221466935484, 0.606781584091719, 0.606338148955467, 0.605891237046528, 0.605440923882543, 0.604987284974982, 0.60453039582527, 0.604070331920787, 0.60360716873101, 0.60314098170356, 0.60267184626035, 0.602199837793716, 0.601725031662553, 0.601247503188496, 0.600767327652095, 0.600284580288995, 0.599799336286195, 0.599311670778236, 0.598821658843446, 0.598329375500239, 0.597834895703367, 0.597338294340239, 0.596839646227189, 0.596339026105839, 0.59583650863946, 0.595332168409263, 0.594826079910873, 0.594318317550623, 0.593808955642034, 0.593298068402226, 0.592785729948322, 0.592272014293962, 0.591756995345729, 0.591240746899672, 0.590723342637806, 0.59020485612462, 0.589685360803625, 0.589164929993922, 0.588643636886762, 0.588121554542128, 0.587598755885361, 0.587075313703745, 0.586551300643186, 0.586026789204848, 0.585501851741792, 0.584976560455714, 0.584450987393634, 0.583925204444555, 0.583399283336299, 0.582873295632178, 0.582347312727783, 0.581821405847776, 0.581295646042704, 0.580770104185766, 0.5802448509697, 0.579719956903598, 0.579195492309771, 0.578671527320639, 0.578148131875661, 0.57762537571817, 0.577103328392365, 0.576582059240248, 0.57606163739857, 0.57554213179583, 0.575023611149234, 0.574506143961742, 0.573989798519102, 0.573474642886825, 0.572960744907355, 0.572448172197029, 0.571936992143269, 0.571427271901614, 0.570919078392914, 0.570412478300378, 0.569907538066841, 0.569404323891865, 0.568902901728938, 0.568403337282712, 0.567905696006192, 0.56741004309797, 0.566916443499529, 0.566424961892475, 0.565935662695808, 0.565448610063276, 0.564963867880663, 0.564481499763123, 0.564001569052529, 0.563524138814879, 0.563049271837653, 0.562577030627199, 0.562107477406178, 0.561640674110999, 0.561176682389232, 0.560715563597124, 0.560257378797049, 0.559802188755027, 0.559350053938224, 0.55890103451247, 0.558455190339852, 0.558012580976238, 0.55757326566886, 0.557137303353951, 0.556704752654291, 0.556275671876906, 0.555850119010665, 0.555428151723952, 0.555009827362362, 0.554595202946351, 0.554184335169023, 0.553777280393782, 0.553374094652108, 0.552974833641308, 0.552579552722307, 0.552188306917405, 0.551801150908149, 0.551418139033081, 0.551039325285616, 0.55066476331191, 0.550294506408713, 0.549928607521259, 0.549567119241204, 0.549210093804489, 0.548857583089307, 0.548509638614085, 0.548166311535437, 0.547827652646114, 0.547493712373043, 0.547164540775368, 0.546840187542409, 0.546520701991827, 0.546206133067569, 0.545896529338047, 0.545591938994186, 0.545292409847574, 0.544997989328559, 0.544708724484448, 0.54442466197761, 0.544145848083715, 0.543872328689909, 0.543604149293018, 0.543341354997779, 0.543083990515146, 0.542832100160443, 0.542585727851755, 0.542344917108141, 0.54210971104798, 0.541880152387357, 0.541656283438267, 0.541438146107098, 0.541225781892992, 0.541019231886172, 0.540818536766408, 0.540623736801453, 0.54043487184544, 0.540251981337354, 0.540075104299545, 0.539904279336164, 0.539739544631706, 0.539580937949544, 0.539428496630405, 0.539282257590988, 0.539142257322538, 0.539008531889395, 0.538881116927622, 0.538760047643605, 0.538645358812757, 0.538537084778053, 0.538435259448833, 0.538339916299386, 0.538251088367696, 0.538168808254179, 0.538093108120378, 0.538024019687724, 0.537961574236329, 0.537905802603715, 0.537856735183685, 0.537814401925121, 0.537778832330748, 0.537750055456077, 0.537728099908204, 0.537712993844724, 0.537704764972648, 0.537703440547223, 0.537709047370965, 0.537721611792605, 0.537741159705975, 0.537767716549001, 0.537801307302802, 0.537841956490568, 0.537889688176634, 0.537944525965558, 0.538006493001169, 0.538075611965612, 0.538151905078447, 0.538235394095814, 0.538326100309472, 0.53842404454603, 0.53852924716599, 0.53864172806307, 0.538761506663244, 0.538888601924085, 0.539023032333862, 0.539164815910887, 0.539313970202673, 0.539470512285332, 0.539634458762677, 0.539805825765757, 0.539984628951959, 0.540170883504472, 0.540364604131663, 0.540565805066304, 0.540774500065103, 0.54099070240804, 0.541214424897777, 0.541445679859139, 0.541684479138513, 0.541930834103348, 0.542184755641621, 0.542446254161335, 0.542715339590061, 0.542992021374446, 0.543276308479767, 0.54356820938947, 0.543867732104826, 0.544174884144417, 0.544489672543866, 0.544812103855374, 0.545142184147413, 0.545479919004363, 0.545825313526234, 0.546178372328342, 0.546539099540932, 0.546907498809068, 0.547283573292214, 0.547667325664135, 0.548058758112628, 0.548457872339165, 0.548864669558963, 0.549279150500599, 0.549701315405989, 0.55013116403009, 0.550568695641013, 0.551013909019568, 0.5514668024596, 0.551927373767455, 0.552395620262313, 0.552871538775912, 0.553355125652556, 0.553846376749159, 0.554345287435169, 0.554851852592738, 0.555366066616541, 0.555887923414008, 0.556417416405321, 0.556954538523456, 0.557499282214424, 0.558051639437185, 0.558611601664, 0.559179159880433, 0.559754304585535, 0.560337025792076, 0.560927313026686, 0.56152515533017, 0.562130541257629, 0.562743458878731, 0.563363895778021, 0.563991839055159, 0.564627275325285, 0.565270190719167, 0.565920570883779, 0.566578400982371, 0.567243665695099, 0.567916349219114, 0.568596435269302, 0.569283907078321, 0.569978747397343, 0.570680938496304, 0.571390462164456, 0.572107299710741, 0.572831431964476, 0.573562839275602, 0.574301501515403, 0.575047398076989, 0.575800507875855, 0.57656080935046, 0.577328280462741, 0.578102898698831, 0.578884641069604, 0.579673484111372, 0.58046940388649, 0.581272375984042, 0.582082375520517, 0.582899377140556, 0.583723355017566, 0.584554282854648, 0.585392133885141, 0.586236880873432, 0.587088496115948, 0.587946951441627, 0.588812218213006, 0.589684267326859, 0.590563069215257, 0.591448593846227, 0.592340810724736, 0.593239688893574, 0.594145196934306, 0.595057302968107, 0.595975974656785, 0.59690117920376, 0.597832883354972, 0.598771053399887, 0.599715655172617, 0.6006666540528, 0.601624014966747, 0.602587702388409, 0.603557680340588, 0.604533912395899, 0.605516361677995, 0.606504990862525, 0.607499762178498, 0.608500637409244, 0.609507577893725, 0.610520544527668, 0.611539497764705, 0.612564397617773, 0.613595203660131, 0.61463187502685, 0.615674370415885, 0.616722648089486, 0.617776665875453, 0.618836381168405, 0.619901750931334, 0.620972731696613, 0.622049279567698, 0.623131350220308, 0.624218898903897, 0.625311880443117, 0.626410249239091, 0.627513959271072, 0.628622964097767, 0.629737216858911, 0.630856670276719, 0.631981276657283, 0.633110987892426, 0.634245755460885, 0.635385530430146, 0.63653026345784, 0.637679904793535, 0.63883440428012, 0.63999371135558, 0.641157775054692, 0.642326544010507, 0.643499966456178, 0.644677990226591, 0.645860562760162, 0.647047631100363, 0.64823914189773, 0.649435041411398, 0.65063527551104, 0.651839789678533, 0.653048529009855, 0.654261438216878, 0.655478461629208, 0.656699543196052, 0.657924626487994, 0.659153654699176, 0.660386570648816, 0.661623316783411, 0.662863835178546, 0.664108067540905, 0.665355955210238, 0.666607439161269, 0.667862460005889, 0.669120957994952, 0.670382873020404, 0.671648144617398, 0.672916711966333, 0.674188513894818, 0.675463488879994, 0.676741575050409, 0.678022710188348, 0.679306831731891, 0.680593876777101, 0.681883782080188, 0.683176484059762, 0.684471918798905, 0.685770022047622, 0.687070729224956, 0.688373975421195, 0.689679695400305, 0.690987823602098, 0.692298294144583, 0.693611040826438, 0.69492599712906, 0.696243096219167, 0.697562270951101, 0.698883453869241, 0.700206577210335, 0.701531572906075, 0.702858372585314, 0.704186907576832, 0.705517108911529, 0.706848907325034, 0.708182233260255, 0.709517016869935, 0.710853188018897, 0.712190676286982, 0.713529410971441, 0.714869321089528, 0.716210335381145, 0.717552382311356, 0.718895390073214, 0.720239286590233, 0.72158399951925, 0.722929456252788, 0.724275583922194, 0.725622309400069, 0.726969559302993, 0.728317259994443, 0.729665337587322, 0.731013717947135, 0.732362326694407, 0.733711089207616, 0.735059930626068, 0.736408775852816, 0.737757549557346, 0.739106176178583, 0.74045457992781, 0.741802684791378, 0.74315041453402, 0.744497692701381, 0.745844442623272, 0.747190587416538, 0.748536049988062, 0.749880753037699, 0.75122461906145, 0.752567570354521, 0.753909529014178, 0.755250416943016, 0.756590155851952, 0.757928667263408, 0.75926587251443, 0.760601692759694, 0.76193604897494, 0.763268861959765, 0.764600052341156, 0.765929540576601, 0.767257246957268, 0.768583091611107, 0.769906994506462, 0.771228875455034, 0.772548654115274, 0.773866249995718, 0.775181582458246, 0.776494570721568, 0.777805133864285, 0.779113190828519, 0.780418660423265, 0.781721461327702, 0.783021512094636, 0.784318731153937, 0.78561303681609, 0.786904347275554, 0.788192580614271, 0.789477654805073, 0.790759487715426, 0.792037997110775, 0.793313100658097, 0.794584715929713, 0.795852760406362, 0.797117151481406, 0.798377806463981, 0.799634642582876, 0.800887576990021, 0.802136526764287, 0.803381408915031, 0.804622140386053, 0.805858638058944, 0.807090818756918, 0.808318599248934, 0.8095418962529, 0.810760626439707, 0.811974706437179, 0.813184052833517, 0.814388582181568, 0.81558821100221, 0.816782855788485, 0.817972433009483, 0.819156859114048, 0.820336050534947, 0.821509923692438, 0.822678394998718, 0.823841380861313, 0.824998797687448, 0.826150561887802, 0.827296589880703, 0.828436798096028, 0.829571102979311, 0.830699420995696, 0.831821668634053, 0.832937762411162, 0.834047618875625, 0.835151154612216, 0.836248286245723, 0.83733893044545, 0.838423003928984, 0.839500423466832, 0.840571105886285, 0.8416349680756, 0.842691926988513, 0.843741899648275, 0.844784803152024, 0.845820554675002, 0.846849071474826, 0.847870270895933, 0.848884070373712, 0.849890387439034, 0.850889139722529, 0.851880244958911, 0.852863620991649, 0.853839185776854, 0.854806857388243, 0.855766554021302, 0.856718193997836, 0.857661695770197, 0.858596977926399, 0.859523959193806, 0.860442558444298, 0.86135269469855, 0.862254287130552, 0.863147255072369, 0.864031518018404, 0.864906995630534, 0.865773607742165, 0.866631274363162, 0.867479915684548, 0.868319452082892, 0.869149804125473, 0.869970892574544, 0.870782638392152, 0.87158496274506, 0.872377787009305, 0.873161032775057, 0.873934621851352, 0.874698476270957, 0.875452518295219, 0.876196670418663, 0.876930855374048, 0.877654996137498, 0.878369015932589, 0.879072838236037, 0.879766386782414, 0.880449585568772, 0.881122358859875, 0.881784631193165, 0.882436327383371, 0.883077372528447, 0.883707692013084, 0.884327211515328, 0.884935857010574, 0.885533554776953, 0.886120231400344, 0.886695813779645, 0.887260229131899, 0.887813404996899, 0.888355269243056, 0.888885750072069, 0.889404776024415, 0.889912275984105, 0.890408179184371, 0.890892415212588, 0.891364914015694, 0.891825605905423, 0.89227442156331, 0.892711292046292, 0.893136148791924, 0.893548923623737, 0.893949548756307, 0.894337956801263, 0.894714080771664, 0.895077854088423, 0.895429210584944, 0.895768084513086, 0.896094410547949, 0.89640812379402, 0.896709159790352, 0.896997454515919, 0.897272944395225, 0.897535566303896, 0.897785257574193, 0.898021956000228, 0.898245599844357, 0.898456127841651, 0.898653479206445, 0.898837593637353, 0.899008411323242, 0.899165872948661, 0.899309919699775, 0.899440493269711, 0.899557535864465, 0.899660990208406, 0.899750799550509, 0.899826907669429, 0.899889258879618, 0.899937798037233, 0.89997247054562, 0.899993222361481, 0.9, 0.899992750541857, 0.89997142163775, 0.89993596151525, 0.899886318984406, 0.899822443443466, 0.899744284884891, 0.899651793901689, 0.899544921692441, 0.899423620068454, 0.899287841458877, 0.899137538917027, 0.898972666126127, 0.898793177406037, 0.898599027718564, 0.898390172673879, 0.898166568536446, 0.897928172231561, 0.897674941350663, 0.897406834158346, 0.897123809597795, 0.896825827297555, 0.89651284757718, 0.896184831453812, 0.895841740648186, 0.895483537590923, 0.895110185428963, 0.894721648031418, 0.894317889996312, 0.893898876656505, 0.893464574086139, 0.893014949107305, 0.892549969295683, 0.892069602987508, 0.89157381928565, 0.891062588066179, 0.890535879984679, 0.889993666482716, 0.889435919794124, 0.888862612951816, 0.888273719793777, 0.887669214970105, 0.887049073949015, 0.88641327302372, 0.885761789318864, 0.885094600796924, 0.884411686264854, 0.883713025381231, 0.882998598661558, 0.882268387486595, 0.881522374107342, 0.88076054165288, 0.879982874136533, 0.879189356462491, 0.878379974432836, 0.877554714754045, 0.876713565043805, 0.875856513837671, 0.874983550595735, 0.874094665709952, 0.873189850510349, 0.872269097271757, 0.871332399221584, 0.870379750545634, 0.869411146395173, 0.868426582894555, 0.867426057147103, 0.866409567242522, 0.865377112264205, 0.864328692295258, 0.863264308426401, 0.862183962762265, 0.861087658428702, 0.859975399579888, 0.85884719140505, 0.857703040135775, 0.856542953052941, 0.85536693849383, 0.85417500585924, 0.852967165620494, 0.851743429326792, 0.850503809612027, 0.849248320202338, 0.847976975922932, 0.846689792705445, 0.845386787595147, 0.844067978758193, 0.842733385488777, 0.841383028216298, 0.840016928512839, 0.838635109100581, 0.837237593858701, 0.835824407831001, 0.834395577232978, 0.832951129459515, 0.831491093092224, 0.830015497906256, 0.828524374878466, 0.827017756194549, 0.825495675256333, 0.823958166689126, 0.822405266349787, 0.820837011333707, 0.819253439982226, 0.817654591890391, 0.816040507914625, 0.814411230179996, 0.812766802087856, 0.811107268323552, 0.809432674863711, 0.80774306898409, 0.806038499267666, 0.804319015611156, 0.802584669233704, 0.800835512684063, 0.799071599848303, 0.797292985957866, 0.79549972759686, 0.793691882710176, 0.791869510611117, 0.790032671988665, 0.788181428916485, 0.786315844859384, 0.784435984682004, 0.782541914656291, 0.780633702469779, 0.778711417232788, 0.776775129486738, 0.774824911212377, 0.772860835836915, 0.770882978242507, 0.768891414773982, 0.766886223247336, 0.76486748295687, 0.76283527468377, 0.760789680703966, 0.758730784796137, 0.756658672250052, 0.754573429874163, 0.752475146003969, 0.750363910510262, 0.748239814806848, 0.746102951859156, 0.743953416191597, 0.741791303897142, 0.739616712643816, 0.737429741684177, 0.735230491863015, 0.733019065625357, 0.730795567025522, 0.728560101734368, 0.726312777048275, 0.724053701897355, 0.721782986853663, 0.719500744139097, 0.717207087634727, 0.714902132888077, 0.712585997122572, 0.710258799244838, 0.707920659854097, 0.705571701250019, 0.703212047441224, 0.700841824153495, 0.698461158839596, 0.696070180685726, 0.693669020621713, 0.691257811328217, 0.688836687246655, 0.686405784586844, 0.683965241335305, 0.681515197264948, 0.679055793942606, 0.676587174738462, 0.67410948483398, 0.67162287123108, 0.669127482760841, 0.666623470091548, 0.664110985738363, 0.66159018407121, 0.659061221323656, 0.65652425560224, 0.653979446894472, 0.651426957078397, 0.648866949930454, 0.646299591135428, 0.643725048294018, 0.641143490932988, 0.638555090512749, 0.6359600204377, 0.633358456063289, 0.630750574707115, 0.628136555655774, 0.625516580175161, 0.622890831518824, 0.620259494937398, 0.617622757687031, 0.614980809038842, 0.612333840288038, 0.609682044762249, 0.607025617831449, 0.604364756916415, 0.601699661498419, 0.599030533127477, 0.596357575432496, 0.593680994129622, 0.591000997031624, 0.588317794057418, 0.585631597240594, 0.582942620739496, 0.580251080845558, 0.57755719599311, 0.574861186768416, 0.572163275918674, 0.569463688362383, 0.566762651197432, 0.564060393710748, 0.5613571473882, 0.558653145922959, 0.555948625226242, 0.553243823434843, 0.550538980922723, 0.547834340308429, 0.545130146465932, 0.542426646533162, 0.539724089922071, 0.537022728328155, 0.534322815739115, 0.531624608445406, 0.528928365049221, 0.526234346474183, 0.523542815974726, 0.520854039146463, 0.518168283933928, 0.515485820642588, 0.512806921946876, 0.510131862900269, 0.507460920944994, 0.504794375921345, 0.50213251007832, 0.499475608082341, 0.496823957027192, 0.494177846444534, 0.491537568312258, 0.488903417065804, 0.486275689606652, 0.483654685313273, 0.481040706049823, 0.478434056176715, 0.475835042560664, 0.473243974583812, 0.470661164153982, 0.468086925715214, 0.46552157625614, 0.462965435321435, 0.460418825021632, 0.457882070041939, 0.455355497653283, 0.452839437722033, 0.450334222719828, 0.447840187734006, 0.445357670477301, 0.442887011297926, 0.44042855319036, 0.437982641804019, 0.435549625454709, 0.433129855134341, 0.430723684520824, 0.428331469988682, 0.425953570618347, 0.423590348208022, 0.421242167282016, 0.418909395102028, 0.416592401677614, 0.414291559775606, 0.412007244931095, 0.40973983545734, 0.407489712456124, 0.405257259828321, 0.403042864283885, 0.400846915352818, 0.398669805394988, 0.396511929610295, 0.39437368605025, 0.392255475626643, 0.390157702123975, 0.388080772208457, 0.386025095438708, 0.38399108427691, 0.381979154098689, 0.379989723204079, 0.378023212827565, 0.376080047148983];
