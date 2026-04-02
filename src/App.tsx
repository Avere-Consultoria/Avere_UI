import { useState } from 'react';
import { toast } from 'sonner';
import {
    LayoutDashboard, Users, BarChart2, Settings, Bell,
    Download, Trash2, Edit, User, Layers, FormInput, MessageSquare, Database
} from 'lucide-react';

// Layout
import { SideBar, SideBarItem } from './components/SideBar';
import { TopBar } from './components/TopBar';

// Typography & Atoms
import { Typography } from './components/Typography';
import { Badge } from './components/Badge';
import { Avatar } from './components/Avatar';
import { Spinner } from './components/Spinner';

// Buttons & Forms
import { Button } from './components/Button';
import { TextField } from './components/TextField';
import { Checkbox } from './components/Checkbox';
import { RadioGroup, RadioItem } from './components/RadioGroup';
import { Slider } from './components/Slider';
import { Switch } from './components/Switch';
import { Combobox } from './components/Combobox';
import { MultiSelect } from './components/MultiSelect';
import { TagInput } from './components/TagInput';
import { DatePicker } from './components/DatePicker';
import { FileUpload } from './components/FileUpload';

// Overlays & Feedback
import { Toaster } from './components/Toaster';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './components/Tooltip';
import {
    Modal, ModalContent, ModalHeader, ModalFooter,
    ModalTitle, ModalDescription, ModalTrigger
} from './components/Modal';
import {
    DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
    DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator
} from './components/DropdownMenu';

// Data & Other
import { DataTable, type ColumnDef } from './components/DataTable';
import { Card } from './components/Card';
import { HierarchicalCombobox } from './components/HierarchicalCombobox';

import styles from './App.module.css';


// ─── Mock data ────────────────────────────────────────────────────────────────
interface Person { id: string; name: string; role: string; status: string; }
const MOCK_DATA: Person[] = [
    { id: '1', name: 'Ana Beatriz', role: 'Analista', status: 'Ativo' },
    { id: '2', name: 'Carlos Eduardo', role: 'Gestor', status: 'Ativo' },
    { id: '3', name: 'Fernanda Lima', role: 'Coordenadora', status: 'Inativo' },
    { id: '4', name: 'Ricardo Souza', role: 'Analista', status: 'Ativo' },
];
const TABLE_COLS: ColumnDef<Person>[] = [
    { header: 'Nome', accessorKey: 'name', sortable: true },
    { header: 'Cargo', accessorKey: 'role', sortable: true },
    {
        header: 'Status', accessorKey: 'status', sortable: true,
        cell: (row) => (
            <Badge intent={row.status === 'Ativo' ? 'primaria' : 'erro'} variant="ghost">
                {row.status}
            </Badge>
        )
    },
];
const selectOptions = [
    { label: 'Análise de Dados', value: 'data' },
    { label: 'Desenvolvimento', value: 'dev' },
    { label: 'Design UI/UX', value: 'design' },
    { label: 'Gestão de Projetos', value: 'pm' },
    { label: 'Recursos Humanos', value: 'rh' },
];
const HIER_LEVELS = [
    {
        id: 'area', label: 'Área', placeholder: 'Selecione a área...',
        icon: Layers,
        options: [{ value: 'ti', label: 'TI' }, { value: 'fin', label: 'Financeiro' }]
    },
    {
        id: 'setor', label: 'Setor', placeholder: 'Selecione o setor...',
        options: [{ value: 'dev', label: 'Desenvolvimento' }, { value: 'infra', label: 'Infraestrutura' }]
    },
];

// ─── NAV items ────────────────────────────────────────────────────────────────
const NAV: { icon: React.ElementType; label: string; id: string }[] = [
    { icon: LayoutDashboard, label: 'Dashboard', id: 'layout' },
    { icon: FormInput, label: 'Formulários', id: 'forms' },
    { icon: MessageSquare, label: 'Feedback', id: 'feedback' },
    { icon: Database, label: 'Dados', id: 'data' },
    { icon: Users, label: 'Avatar & Badge', id: 'atoms' },
    { icon: BarChart2, label: 'Tipografia', id: 'typography' },
    { icon: Settings, label: 'Configurações', id: 'settings' },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function App() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('layout');

    // Form states
    const [textVal, setTextVal] = useState('');
    const [checkVal, setCheckVal] = useState(false);
    const [radioVal, setRadioVal] = useState('opt1');
    const [sliderVal, setSliderVal] = useState([50]);
    const [switchVal, setSwitchVal] = useState(false);
    const [comboVal, setComboVal] = useState('');
    const [multiVal, setMultiVal] = useState<string[]>([]);
    const [tagsVal, setTagsVal] = useState<string[]>(['avere', 'ui']);
    const [dateVal, setDateVal] = useState<Date | undefined>(undefined);

    const sectionTitle = NAV.find(n => n.id === activeSection)?.label ?? 'Showroom';

    return (
        <div className={styles.appLayout}>
            <SideBar
                isCollapsed={isCollapsed}
                onToggle={() => setIsCollapsed(c => !c)}
                isOpenMobile={isMobileOpen}
                onCloseMobile={() => setIsMobileOpen(false)}
                userName="Luiz Avere"
                userRole="Desenvolvedor"
                logo={
                    <div className={styles.logoText}>
                        {isCollapsed ? 'A' : 'avere·ui'}
                    </div>
                }
            >
                {NAV.map(item => (
                    <SideBarItem
                        key={item.id}
                        icon={item.icon}
                        label={item.label}
                        active={activeSection === item.id}
                        onClick={() => setActiveSection(item.id)}
                    />
                ))}
            </SideBar>

            <div className={styles.mainWrapper}>
                <TopBar
                    onToggleMobile={() => setIsMobileOpen(o => !o)}
                />

                <main className={styles.main}>
                    <div className={styles.pageHeader}>
                        <Typography variant="h1">{sectionTitle}</Typography>
                        <Badge intent="primaria" variant="ghost">avere·ui design system</Badge>
                    </div>

                    {/* ── LAYOUT SECTION ─────────────────────────────── */}
                    {activeSection === 'layout' && (
                        <div className={styles.sections}>
                            <ShowSection title="Botões — intent × variant">
                                <div className={styles.row}>
                                    {(['primaria', 'secundaria', 'alerta', 'erro'] as const).map(intent =>
                                        (['solid', 'outline', 'ghost'] as const).map(variant => (
                                            <Button key={`${intent}-${variant}`} intent={intent} variant={variant}>
                                                {intent} · {variant}
                                            </Button>
                                        ))
                                    )}
                                </div>
                                <div className={styles.row}>
                                    <Button size="sm">Small</Button>
                                    <Button size="md">Medium</Button>
                                    <Button size="lg">Large</Button>
                                    <Button isLoading>Carregando...</Button>
                                    <Button leftIcon={Download}>Com ícone</Button>
                                    <Button disabled>Desabilitado</Button>
                                </div>
                            </ShowSection>

                            <ShowSection title="Card">
                                <div className={styles.row}>
                                    <Card style={{ width: 280 }}>
                                        <Typography variant="h3">Card Padrão</Typography>
                                        <Typography variant="p" style={{ marginTop: 8 }}>
                                            Um card simples utilizando o componente Card do design system.
                                        </Typography>
                                        <div className={styles.row} style={{ marginTop: 16 }}>
                                            <Button size="sm">Ação</Button>
                                            <Button size="sm" variant="ghost" intent="secundaria">Cancelar</Button>
                                        </div>
                                    </Card>
                                    <Card style={{ width: 280 }}>
                                        <div className={styles.row}>
                                            <Avatar initials="AB" size="lg" />
                                            <div>
                                                <Typography variant="h4">Ana Beatriz</Typography>
                                                <Typography variant="p">Analista Sênior</Typography>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </ShowSection>
                        </div>
                    )}

                    {/* ── FORMS SECTION ──────────────────────────────── */}
                    {activeSection === 'forms' && (
                        <div className={styles.sections}>
                            <ShowSection title="TextField">
                                <div className={styles.formGrid}>
                                    <TextField label="Nome completo" placeholder="Digite seu nome..." value={textVal} onChange={e => setTextVal(e.target.value)} />
                                    <TextField label="Com erro" placeholder="Campo obrigatório" error="Este campo é obrigatório" />
                                    <TextField label="Desabilitado" placeholder="Não editável" disabled />
                                    <TextField label="Com ícone" leftIcon={User} placeholder="Buscar usuário..." />
                                </div>
                            </ShowSection>

                            <ShowSection title="Combobox & MultiSelect">
                                <div className={styles.formGrid}>
                                    <Combobox
                                        label="Combobox"
                                        options={selectOptions}
                                        value={comboVal}
                                        onChange={setComboVal}
                                        placeholder="Digite para filtrar..."
                                    />
                                    <MultiSelect
                                        label="MultiSelect"
                                        options={selectOptions}
                                        value={multiVal}
                                        onChange={setMultiVal}
                                        placeholder="Selecione habilidades..."
                                    />
                                    <MultiSelect
                                        label="MultiSelect com erro"
                                        options={selectOptions}
                                        error="Selecione ao menos uma opção"
                                    />
                                </div>
                            </ShowSection>

                            <ShowSection title="TagInput & DatePicker">
                                <div className={styles.formGrid}>
                                    <TagInput
                                        label="Tags"
                                        value={tagsVal}
                                        onChange={setTagsVal}
                                        placeholder="Digite e pressione Enter..."
                                    />
                                    <DatePicker
                                        label="Data"
                                        date={dateVal}
                                        onSelect={setDateVal}
                                        placeholder="Selecione uma data..."
                                    />
                                </div>
                            </ShowSection>

                            <ShowSection title="Checkbox, RadioGroup &amp; Switch">
                                <div className={styles.row}>
                                    <Checkbox label="Aceito os termos" checked={checkVal} onChange={e => setCheckVal(e.target.checked)} />
                                    <Checkbox label="Desabilitado (marcado)" checked disabled />
                                    <Switch checked={switchVal} onCheckedChange={setSwitchVal} label={switchVal ? 'Ativo' : 'Inativo'} />
                                </div>
                                <RadioGroup
                                    value={radioVal}
                                    onValueChange={setRadioVal}
                                >
                                    <RadioItem value="opt1" label="Baixa" />
                                    <RadioItem value="opt2" label="Média" />
                                    <RadioItem value="opt3" label="Alta" />
                                </RadioGroup>
                            </ShowSection>

                            <ShowSection title="Slider">
                                <div style={{ maxWidth: 400 }}>
                                    <Typography variant="p" style={{ marginBottom: 8 }}>Valor: {sliderVal[0]}%</Typography>
                                    <Slider value={sliderVal} onValueChange={setSliderVal} min={0} max={100} step={5} />
                                </div>
                            </ShowSection>

                            <ShowSection title="FileUpload">
                                <FileUpload label="Enviar documento" accept=".pdf,.docx" maxSize={2 * 1024 * 1024} />
                            </ShowSection>

                            <ShowSection title="HierarchicalCombobox">
                                <HierarchicalCombobox levels={HIER_LEVELS} />
                            </ShowSection>
                        </div>
                    )}

                    {/* ── FEEDBACK SECTION ───────────────────────────── */}
                    {activeSection === 'feedback' && (
                        <div className={styles.sections}>
                            <ShowSection title="Badge">
                                <div className={styles.row}>
                                    {(['primaria', 'secundaria', 'alerta', 'erro'] as const).map(intent =>
                                        (['solid', 'outline', 'ghost'] as const).map(variant => (
                                            <Badge key={`${intent}-${variant}`} intent={intent} variant={variant}>
                                                {intent}
                                            </Badge>
                                        ))
                                    )}
                                </div>
                            </ShowSection>

                            <ShowSection title="Spinner">
                                <div className={styles.row}>
                                    <Spinner size="sm" />
                                    <Spinner size="md" />
                                    <Spinner size="lg" />
                                </div>
                            </ShowSection>

                            <ShowSection title="Toast (Sonner)">
                                <div className={styles.row}>
                                    <Button onClick={() => toast.success('Operação realizada com sucesso!')}>Toast Sucesso</Button>
                                    <Button intent="erro" onClick={() => toast.error('Erro ao processar solicitação.')}>Toast Erro</Button>
                                    <Button intent="alerta" onClick={() => toast.warning('Atenção: ação irreversível.')}>Toast Alerta</Button>
                                    <Button variant="outline" intent="secundaria" onClick={() => toast.info('Informação importante.')}>Toast Info</Button>
                                </div>
                            </ShowSection>

                            <ShowSection title="Tooltip">
                                <div className={styles.row}>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="outline" intent="secundaria">Hover aqui (top)</Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Tooltip simples acima</TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="outline" intent="secundaria">Hover aqui (bottom)</Button>
                                            </TooltipTrigger>
                                            <TooltipContent side="bottom">Tooltip abaixo</TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="outline" intent="secundaria">Hover aqui (right)</Button>
                                            </TooltipTrigger>
                                            <TooltipContent side="right">Tooltip à direita</TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </ShowSection>

                            <ShowSection title="Modal">
                                <div className={styles.row}>
                                    <Modal>
                                        <ModalTrigger asChild>
                                            <Button>Abrir Modal Padrão</Button>
                                        </ModalTrigger>
                                        <ModalContent>
                                            <ModalHeader>
                                                <ModalTitle>Confirmar Ação</ModalTitle>
                                                <ModalDescription>
                                                    Esta ação não pode ser desfeita. Tem certeza que deseja continuar?
                                                </ModalDescription>
                                            </ModalHeader>
                                            <ModalFooter>
                                                <Button variant="ghost" intent="secundaria">Cancelar</Button>
                                                <Button intent="primaria">Confirmar</Button>
                                            </ModalFooter>
                                        </ModalContent>
                                    </Modal>

                                    <Modal>
                                        <ModalTrigger asChild>
                                            <Button intent="erro" variant="outline">Modal Destrutivo</Button>
                                        </ModalTrigger>
                                        <ModalContent>
                                            <ModalHeader>
                                                <ModalTitle>Excluir Registro</ModalTitle>
                                                <ModalDescription>
                                                    Você está prestes a excluir este registro permanentemente. Esta ação não pode ser revertida.
                                                </ModalDescription>
                                            </ModalHeader>
                                            <ModalFooter>
                                                <Button variant="ghost" intent="secundaria">Cancelar</Button>
                                                <Button intent="erro"><Trash2 size={16} /> Excluir</Button>
                                            </ModalFooter>
                                        </ModalContent>
                                    </Modal>
                                </div>
                            </ShowSection>

                            <ShowSection title="DropdownMenu">
                                <div className={styles.row}>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" intent="secundaria">Opções ▾</Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => toast.info('Editando...')}><Edit size={14} /> Editar</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => toast.info('Exportando...')}><Download size={14} /> Exportar</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => toast.error('Excluindo...')} className={styles.destructive}><Trash2 size={14} /> Excluir</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </ShowSection>
                        </div>
                    )}

                    {/* ── DATA TABLE SECTION ───────────────────────────── */}
                    {activeSection === 'data' && (
                        <div className={styles.sections}>
                            <ShowSection title="DataTable">
                                <DataTable
                                    data={MOCK_DATA}
                                    columns={TABLE_COLS}
                                    keyExtractor={r => r.id}
                                    selectable
                                    actions={[
                                        { label: 'Editar', onClick: r => toast.info(`Editando ${r.name}`) },
                                        { label: 'Excluir', onClick: r => toast.error(`Excluindo ${r.name}`), isDestructive: true },
                                    ]}
                                />
                            </ShowSection>
                        </div>
                    )}

                    {/* ── ATOMS SECTION ───────────────────────────────── */}
                    {activeSection === 'atoms' && (
                        <div className={styles.sections}>
                            <ShowSection title="Avatar">
                                <div className={styles.row}>
                                    <Avatar initials="AB" size="sm" />
                                    <Avatar initials="CD" size="md" />
                                    <Avatar initials="EF" size="lg" />
                                    <Avatar src="https://i.pravatar.cc/150?img=7" initials="GH" size="md" />
                                    <Avatar src="https://i.pravatar.cc/150?img=12" initials="IJ" size="lg" />
                                </div>
                            </ShowSection>
                        </div>
                    )}

                    {/* ── TYPOGRAPHY SECTION ───────────────────────────── */}
                    {activeSection === 'typography' && (
                        <div className={styles.sections}>
                            <ShowSection title="Escala Tipográfica">
                                <Typography variant="h1">H1 — Título Principal</Typography>
                                <Typography variant="h2">H2 — Subtítulo</Typography>
                                <Typography variant="h3">H3 — Seção</Typography>
                                <Typography variant="h4">H4 — Subseção</Typography>
                                <Typography variant="p">
                                    P — Parágrafo de texto corrido. O sistema de tipografia do avere·ui usa tokens de design
                                    para garantir consistência em toda a plataforma institucional.
                                </Typography>
                            </ShowSection>
                        </div>
                    )}

                    {/* ── SETTINGS PLACEHOLDER ─────────────────────────── */}
                    {activeSection === 'settings' && (
                        <div className={styles.sections}>
                            <ShowSection title="Em desenvolvimento">
                                <div className={styles.emptyState}>
                                    <Bell size={48} style={{ opacity: 0.2 }} />
                                    <Typography variant="h3" style={{ marginTop: 16 }}>
                                        Seção em construção
                                    </Typography>
                                    <Typography variant="p">
                                        Esta seção será adicionada em breve.
                                    </Typography>
                                </div>
                            </ShowSection>
                        </div>
                    )}
                </main>
            </div>

            <Toaster richColors position="top-right" />
        </div>
    );
}

// ─── Helper section wrapper ────────────────────────────────────────────────────
function ShowSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className={styles.section}>
            <Typography variant="h3" className={styles.sectionTitle}>{title}</Typography>
            <div className={styles.sectionContent}>{children}</div>
        </section>
    );
}
