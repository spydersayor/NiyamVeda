from fastapi import APIRouter
from app.schemas.models import SimulationRequest, SimulationResult
from app.services.simulation_service import simulation_service

router = APIRouter(prefix="/api/simulation", tags=["What-If Simulation"])

@router.post("", response_model=SimulationResult)
def run_simulation(req: SimulationRequest):
    return simulation_service.simulate(req)
