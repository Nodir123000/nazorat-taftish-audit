"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.planningService = void 0;
var prisma_1 = require("../db/prisma");
exports.planningService = {
    // Annual Plans
    getAnnualPlans: function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var where;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        where = {};
                        if (filters === null || filters === void 0 ? void 0 : filters.year)
                            where.year = filters.year;
                        if (filters === null || filters === void 0 ? void 0 : filters.status)
                            where.status = filters.status;
                        if (filters === null || filters === void 0 ? void 0 : filters.search) {
                            where.OR = [
                                { status: { contains: filters.search, mode: 'insensitive' } },
                                { description: { contains: filters.search, mode: 'insensitive' } },
                            ];
                        }
                        return [4 /*yield*/, prisma_1.prisma.revPlanYear.findMany({
                                where: where,
                                include: {
                                    unit: {
                                        include: {
                                            territory: true
                                        }
                                    },
                                    responsible: true,
                                },
                                orderBy: { year: 'desc' }
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    getAnnualPlan: function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.revPlanYear.findUnique({
                            where: { planId: Number.parseInt(id) },
                            include: {
                                unit: {
                                    include: {
                                        territory: true
                                    }
                                },
                                responsible: true,
                                quarterlyPlans: true,
                            }
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    createAnnualPlan: function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.revPlanYear.create({
                            data: {
                                year: Number(data.year),
                                status: data.status || "draft",
                                startDate: data.startDate ? new Date(data.startDate) : new Date(),
                                endDate: data.endDate ? new Date(data.endDate) : new Date(),
                                unitId: data.unit ? Number.parseInt(data.unit) : undefined,
                                responsibleId: data.responsible ? Number.parseInt(data.responsible) : undefined,
                                incomingNumber: data.incomingNumber,
                                incomingDate: data.incomingDate ? new Date(data.incomingDate) : null,
                                objectsTotal: Number(data.objectsTotal) || 0,
                                objectsFS: Number(data.objectsFS) || 0,
                                objectsOS: Number(data.objectsOS) || 0,
                                expenseClassification: data.expenseClassification,
                                supplyDepartment: data.supplyDepartment,
                                controlAuthority: data.controlAuthority,
                                controlObject: data.controlObject,
                                inspectionDirection: data.inspectionDirection ? Number(data.inspectionDirection) : undefined,
                                inspectionType: data.inspectionType ? Number(data.inspectionType) : undefined,
                            }
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    updateAnnualPlan: function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var updateData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        updateData = __assign({}, data);
                        // Преобразование дат и чисел, если они есть в data
                        if (data.startDate)
                            updateData.startDate = new Date(data.startDate);
                        if (data.endDate)
                            updateData.endDate = new Date(data.endDate);
                        if (data.incomingDate)
                            updateData.incomingDate = new Date(data.incomingDate);
                        if (data.unit)
                            updateData.unitId = Number.parseInt(data.unit);
                        if (data.responsible)
                            updateData.responsibleId = Number.parseInt(data.responsible);
                        if (data.objectsTotal !== undefined)
                            updateData.objectsTotal = Number(data.objectsTotal);
                        if (data.objectsFS !== undefined)
                            updateData.objectsFS = Number(data.objectsFS);
                        if (data.objectsOS !== undefined)
                            updateData.objectsOS = Number(data.objectsOS);
                        if (data.inspectionDirection !== undefined)
                            updateData.inspectionDirection = Number(data.inspectionDirection);
                        if (data.inspectionType !== undefined)
                            updateData.inspectionType = Number(data.inspectionType);
                        if (data.controlObject !== undefined)
                            updateData.controlObject = data.controlObject;
                        // Удаляем поля, которых нет в модели или которые уже смаппены
                        delete updateData.unit;
                        delete updateData.responsible;
                        return [4 /*yield*/, prisma_1.prisma.revPlanYear.update({
                                where: { planId: Number.parseInt(id.toString()) },
                                data: updateData
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    deleteAnnualPlan: function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.revPlanYear.delete({
                            where: { planId: Number.parseInt(id) }
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    },
    // Quarterly Plans
    getQuarterlyPlans: function (annualPlanId, filters) {
        return __awaiter(this, void 0, void 0, function () {
            var where;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        where = {};
                        if (annualPlanId)
                            where.annualPlanId = Number.parseInt(annualPlanId);
                        if (filters === null || filters === void 0 ? void 0 : filters.status)
                            where.status = filters.status;
                        return [4 /*yield*/, prisma_1.prisma.quarterlyPlan.findMany({
                                where: where,
                                orderBy: { quarter: 'asc' }
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    getQuarterlyPlan: function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.quarterlyPlan.findUnique({
                            where: { id: Number.parseInt(id) },
                            include: {
                                monthlyPlans: true
                            }
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    // Monthly Plans
    getMonthlyPlans: function (quarterlyPlanId, filters) {
        return __awaiter(this, void 0, void 0, function () {
            var where;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        where = {};
                        if (quarterlyPlanId)
                            where.quarterlyPlanId = Number.parseInt(quarterlyPlanId);
                        if (filters === null || filters === void 0 ? void 0 : filters.status)
                            where.status = filters.status;
                        return [4 /*yield*/, prisma_1.prisma.monthlyPlan.findMany({
                                where: where,
                                orderBy: { month: 'asc' }
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    getMonthlyPlan: function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.monthlyPlan.findUnique({
                            where: { id: Number.parseInt(id) },
                            include: {
                                audits: true
                            }
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    // Placeholders for parts not yet in Prisma schema but present in service
    getOrders: function (params) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, { items: [], total: 0 }];
        }); });
    },
    getOrder: function (id) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, null];
        }); });
    },
    createOrder: function (data) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, __assign({ id: "new" }, data)];
        }); });
    },
    updateOrder: function (id, data) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, __assign({ id: id }, data)];
        }); });
    },
    deleteOrder: function (id) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); });
    },
    getCommissionMembers: function (params) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, []];
        }); });
    },
    addCommissionMember: function (data) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, __assign({ id: "new" }, data)];
        }); });
    },
    updateCommissionMember: function (id, data) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, __assign({ id: id }, data)];
        }); });
    },
    deleteCommissionMember: function (id) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); });
    },
    getPrescriptions: function (params) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, []];
        }); });
    },
    updatePrescription: function (id, data) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, __assign({ id: id }, data)];
        }); });
    },
    deletePrescription: function (id) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); });
    },
    getBriefingTopics: function (params) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, []];
        }); });
    },
    createBriefingTopic: function (data) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, __assign({ id: "new" }, data)];
        }); });
    },
    updateBriefingTopic: function (id, data) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, __assign({ id: id }, data)];
        }); });
    },
    deleteBriefingTopic: function (id) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); });
    },
    getUnplannedAudits: function (params) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, []];
        }); });
    },
    getUnplannedAuditsStats: function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, { total: 0, inProgress: 0, completed: 0, cancelled: 0 }];
        }); });
    },
    createUnplannedAudit: function (data) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, __assign({ id: "new" }, data)];
        }); });
    },
};
